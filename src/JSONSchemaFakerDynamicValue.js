if (typeof Error.captureStackTrace === 'undefined') {
    Error.captureStackTrace = () => {}
}
import jsf from 'json-schema-faker'

import {
    registerDynamicValueClass,
    InputField
} from './__mocks__/Shims'

@registerDynamicValueClass
export default class JSONSchemaFakerDynamicValue {
    static identifier =
        'com.luckymarmot.PawExtensions.JSONSchemaFakerDynamicValue'
    static title = 'JSF'
    static help =
        'https://github.com/luckymarmot/Paw-JSONSchemaFakerDynamicValue'

    static inputs = [
        new InputField('schema', 'Schema', 'JSON', { persisted: true }),
        new InputField(
            'resolveRefs',
            'Resolve References',
            'Checkbox',
            { defaultValue: true }
        ),
        new InputField(
            'predict',
            'Guess Formats',
            'Checkbox',
            { defaultValue: true }
        )
    ]

    title() {
        return 'JSF'
    }

    evaluate(context) {
        jsf.option({
            failOnInvalidTypes: false,
            defaultInvalidTypeProduct: null
        })

        let resolveRefs = this.resolveRefs
        let _schema = this.schema
        let mainKey = '@undefined'
        let schemaDict = this._getSchemaDict(
            context, _schema, resolveRefs, mainKey
        )

        let schema = {
            $$schema: schemaDict[mainKey]
        }

        delete schemaDict[mainKey]
        let schemas = this._materializeSchemas(schemaDict)


        Object.assign(schema, schemas)

        if (this.predict) {
            schema = this._guessFormats(schema)
        }

        let generated = (jsf(schema) || {}).$$schema

        let result
        if (typeof generated === 'object') {
            result = JSON.stringify(generated, null, '  ')
        }
        else {
            result = generated
        }
        return result
    }

    _getSchemaDict(context, _schema, resolveRefs, mainKey) {
        let finalDict = {}
        let schemaList = [
            {
                ref: mainKey,
                schema: _schema
            }
        ]
        let done = {}

        while (schemaList.length > 0) {
            let obj = schemaList.shift()

            let schema = obj.schema
            let currentRef = obj.ref

            let refs = this._findReferences(schema)
            let toDelete = []

            for (let ref of refs) {
                let variable = context.getEnvironmentVariableByName(ref)
                if (resolveRefs && !done[ref] && variable) {
                    let value = variable.getCurrentValue(true).components[0]
                    let vschema
                    try {
                        vschema = JSON.parse(value.schema)
                    }
                    catch (e) {
                        vschema = {}
                    }
                    if (value.type === JSONSchemaFakerDynamicValue.identifier) {
                        schemaList.push({
                            ref: ref,
                            schema: vschema
                        })
                    }
                    done[ref] = true
                }
                else if (
                    !resolveRefs ||
                    typeof variable === 'undefined' ||
                    variable === null
                ) {
                    toDelete.push(ref)
                }
            }

            let cleanedSchema = this._deleteReferences(schema, toDelete)
            finalDict[currentRef] = cleanedSchema
        }

        return finalDict
    }

    _findReferences(schema) {
        let refs = []

        if (typeof schema !== 'object') {
            return refs
        }

        if (schema.$ref) {
            refs.push(schema.$ref)
            return refs
        }

        if (Array.isArray(schema)) {
            for (let sub of schema) {
                refs = refs.concat(this._findReferences(sub))
            }
        }
        else {
            for (let key of Object.keys(schema)) {
                refs = refs.concat(this._findReferences(schema[key]))
            }
        }

        return refs
    }

    _deleteReferences(schema, deleteList) {
        if (typeof schema !== 'object') {
            return schema
        }

        if (schema.$ref) {
            let shouldDelete = false
            if (!deleteList) {
                shouldDelete = true
            }
            else if (deleteList.indexOf(schema.$ref) >= 0) {
                shouldDelete = true
            }

            let obj = {}
            Object.assign(obj, schema)
            if (shouldDelete) {
                delete obj.$ref
            }

            return obj
        }

        let obj
        if (Array.isArray(schema)) {
            obj = []
            for (let sub of schema) {
                obj.push(this._deleteReferences(sub, deleteList))
            }
        }
        else {
            obj = {}
            for (let key of Object.keys(schema)) {
                obj[key] = this._deleteReferences(schema[key], deleteList)
            }
        }

        return obj
    }

    _materializeSchemas(schemas) {
        let baseObj = {}
        for (let path of Object.keys(schemas)) {
            let fragments = path.split('/').slice(1)
            let obj = baseObj
            for (let fragment of fragments) {
                obj[fragment] = obj[fragment] || {}
                obj = obj[fragment]
            }
            Object.assign(obj, schemas[path])
        }

        return baseObj
    }

    _guessFormats(_schema, key) {
        let schema = _schema

        if (typeof schema !== 'object') {
            return schema
        }

        if (schema.type && schema.type === 'string') {
            schema = this._guessStringFormat(schema, key)
        }
        else if (
            schema.type &&
            schema.type === 'integer' ||
            schema.type === 'number'
        ) {
            delete schema.format
        }

        let obj
        if (Array.isArray(schema)) {
            obj = []
            let index = 0
            for (let sub of schema) {
                obj.push(this._guessFormats(sub, index))
                index += 1
            }
        }
        else {
            obj = {}
            for (let _key of Object.keys(schema)) {
                obj[_key] = this._guessFormats(schema[_key], _key)
            }
        }

        return obj
    }

    _guessStringFormat(schema, key) {
        if (schema.faker) {
            return schema
        }

        if (schema.format) {
            let format = schema.format
            delete schema.format
            if (format === 'email') {
                schema.faker = 'internet.email'
            }
            else if (format === 'password') {
                schema.faker = 'internet.password'
            }
            else if (format === 'date-time') {
                schema.faker = 'date.recent'
            }
            else if (format === 'url') {
                schema.faker = 'internet.url'
            }
            else if (format === 'date' && !schema.pattern) {
                schema.pattern = '^20[0-2][0-9]-0[1-9]-[0-2][1-8]$'
            }
            else if (format === 'byte' && !schema.pattern) {
                schema.pattern = '^(?:[A-Za-z0-9+/]{4})*' +
                    '(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$'
            }
            else if (format === 'binary' && !schema.pattern) {
                schema.pattern = '^.*$'
            }
            return schema
        }

        if (key.match(/email/i)) {
            schema.faker = 'internet.email'
        }
        else if (key.match(/name/i)) {
            schema.faker = 'name.findName'
        }
        else if (key.match(/phone/i)) {
            schema.faker = 'phone.phoneNumberFormat'
        }
        else if (key.match(/url/i)) {
            schema.faker = 'internet.url'
        }
        else if (
            typeof schema.pattern === 'undefined' &&
            typeof schema.minLength === 'undefined' &&
            typeof schema.maxLength === 'undefined'
        ) {
            schema.faker = 'company.bsNoun'
        }

        return schema
    }
}
