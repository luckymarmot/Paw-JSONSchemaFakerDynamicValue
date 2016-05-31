import jsf from 'json-schema-faker';

import {
    registerDynamicValueClass,
    InputField,
    DynamicValueInput
} from './__mocks__/Shims'

@registerDynamicValueClass
class JSONSchemaFakerDynamicValue {
    static identifier =
        'com.luckymarmot.PawExtensions.JSONSchemaFakerDynamicValue'
    static title = 'JSON Schema Faker'
    static help =
        'https://github.com/luckymarmot/Paw-JSONSchemaFakerDynamicValue'

    static inputs = [
        InputField('schema', 'Schema', 'JSON', {persisted: true}),
        DynamicValueInput(
            'resolveRefs',
            'Resolve References',
            'Checkbox',
            {defaultValue: true}
        )
    ];

    constructor(domainName) {
        this.ENVIRONMENT_DOMAIN_NAME = domainName || 'Schemas'
    }

    evaluate(context) {
        let domain = context.getEnvironmentDomainByName(
            this.ENVIRONMENT_DOMAIN_NAME
        )

        let resolveRefs = this.resolveRefs
        let _schema = this.schema
        let mainKey = '@undefined'
        let schemaDict = this._getSchemaDict(
            domain, _schema, resolveRefs, mainKey
        )

        let schemas = this._materializeSchemas(schemaDict)

        let schema = {
            $$schema: schemaDict[mainKey]
        }

        Object.assign(schema, schemas)

        return (jsf(schema) || {}).$$schema
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

        if(Array.isArray(schema)) {
            for (let sub of schema) {
                refs = refs.concat(this._findReferences(sub))
            }
        } else {
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
        if(Array.isArray(schema)) {
            obj = []
            for (let sub of schema) {
                obj.push(this._deleteReferences(sub, deleteList))
            }
        } else {
            obj = {}
            for (let key of Object.keys(schema)) {
                obj[key] = this._findReferences(schema[key], deleteList)
            }
        }

        return refs
    }

    _getSchemaDict(domain, _schema, resolveRefs, mainKey) {
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
                let variable = domain.getVariableByName(ref)
                if (resolveRefs && !done[ref] && variable) {
                    let value = variable.getCurrentValue().components[0]
                    if (value.type === JSONSchemaFakerDynamicValue.identifier) {
                        schemaList.push({
                            ref: ref,
                            schema: value.schema
                        })
                    }
                    done[ref] = true
                }
                else if (!resolveRefs || typeof variable === 'undefined') {
                    toDelete.push(ref)
                }
            }

            let cleanedSchema = this._deleteReferences(schema, toDelete)
            finalDict[currentRef] = cleanedSchema
        }

        return finalDict
    }

    _materializeSchemas(schemas) {
        let baseObj = {}
        for (let path of Object.keys(schemas)) {
            let fragments = path.split('/').slice(1)
            let obj = baseObj
            for (let fragment of fragments) {
                obj[fragment] = obj[fragment] || {}
            }
            Object.assign(obj, schemas[path])
        }

        return baseObj
    }
}
