import jsf from 'json-schema-faker'

import {
    registerDynamicValueClass,
    InputField
} from './__mocks__/Shims'

@registerDynamicValueClass
export default class JSONSchemaFakerDynamicValue {
    static identifier =
        'com.luckymarmot.PawExtensions.JSONSchemaFakerDynamicValue'
    static title = 'JSON Schema Faker'
    static help =
        'https://github.com/luckymarmot/Paw-JSONSchemaFakerDynamicValue'

    static inputs = [
        new InputField('schema', 'Schema', 'JSON', { persisted: true }),
        new InputField(
            'resolveRefs',
            'Resolve References',
            'Checkbox',
            { defaultValue: true }
        )
    ];

    evaluate(context) {
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

        let generated = (jsf(schema) || {}).$$schema
        return JSON.stringify(generated, null, '  ')
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
}
