import {
	UnitTest, registerTest, against, targets, desc
} from '../__utils__/TestUtils'

import {
	ClassMock
} from '../__mocks__/Mocks'

import {
    DynamicString,
    PawContextMock,
    EnvironmentVariableMock,
    EnvironmentDomainMock
} from '../__mocks__/PawMocks'

import JSONSchemaFakerDynamicValue from '../JSONSchemaFakerDynamicValue'

@registerTest
@against(JSONSchemaFakerDynamicValue)
export class TestJSONSchemaFakerDynamicValue extends UnitTest {

    @targets('evaluate')
    @desc('evaluate calls context.getEnvironmentDomainByName')
    testEvaluateCallsContextGetEnvironmentDomain() {
        const dv = this.__init()
        const ctx = new PawContextMock()

        ctx.spyOn('getEnvironmentDomainByName', () => {
            return 'test'
        })

        dv.spyOn('_getSchemaDict', () => {
            return {}
        })

        dv.spyOn('_materializeSchemas', () => {
            return {}
        })

        const expected = undefined
        const result = dv.evaluate(ctx)

        this.assertEqual(expected, result)
        this.assertEqual(ctx.spy.getEnvironmentDomainByName.count, 1)
    }

    @targets('evaluate')
    @desc('evaluate calls _getSchemaDict')
    testEvaluateCallsGetSchemaDict() {
        const dv = this.__init()
        const ctx = new PawContextMock()

        ctx.spyOn('getEnvironmentDomainByName', () => {
            return 'test'
        })

        dv.spyOn('_getSchemaDict', () => {
            return {}
        })

        dv.spyOn('_materializeSchemas', () => {
            return {}
        })

        const expected = undefined
        const result = dv.evaluate(ctx)

        this.assertEqual(expected, result)
        this.assertEqual(dv.spy._getSchemaDict.count, 1)
    }

    @targets('evaluate')
    @desc('evaluate calls _materializeSchemas')
    testEvaluateCallsMaterializeSchemas() {
        const dv = this.__init()
        const ctx = new PawContextMock()

        ctx.spyOn('getEnvironmentDomainByName', () => {
            return 'test'
        })

        dv.spyOn('_getSchemaDict', () => {
            return {}
        })

        dv.spyOn('_materializeSchemas', () => {
            return {}
        })

        const expected = undefined
        const result = dv.evaluate(ctx)

        this.assertEqual(expected, result)
        this.assertEqual(dv.spy._materializeSchemas.count, 1)
    }

    @targets('evaluate')
    @desc('evaluate generates the expected (simple) schema')
    testEvaluateGeneratesExpectedSchema() {
        const dv = this.__init()
        const ctx = new PawContextMock()

        ctx.spyOn('getEnvironmentDomainByName', () => {
            return 'test'
        })

        dv.spyOn('_getSchemaDict', () => {
            return {
                '@undefined': {
                    type: 'integer',
                    minimum: 3,
                    maximum: 4
                }
            }
        })

        dv.spyOn('_materializeSchemas', () => {
            return {}
        })

        const expected = 3
        const result = dv.evaluate(ctx)

        this.assertEqual(expected, result)
    }

    @targets('evaluate')
    @desc('evaluate generates the expected referenced schema')
    testEvaluateGeneratesExpectedSchemaWithReferences() {
        const dv = this.__init()
        const ctx = new PawContextMock()

        ctx.spyOn('getEnvironmentDomainByName', () => {
            return 'test'
        })

        dv.spyOn('_getSchemaDict', () => {
            return {
                '@undefined': {
                    $ref: '#/definitions/count'
                }
            }
        })

        dv.spyOn('_materializeSchemas', () => {
            return {
                definitions: {
                    count: {
                        type: 'integer',
                        minimum: 3,
                        maximum: 4
                    }
                }
            }
        })

        const expected = 3
        const result = dv.evaluate(ctx)

        this.assertEqual(expected, result)
    }

    @targets('_getSchemaDict')
    @desc('_getSchemaDict returns schema at correct key with simple schema')
    testGetSchemaDictSimpleCase() {
        const dv = this.__init()
        const domain = new EnvironmentDomainMock()
        const schema = {
            type: 'integer',
            minimum: 3,
            maximum: 4
        }
        const resolveRefs = true
        const key = '@undefined'

        const expected = {
            '@undefined': schema
        }

        const result = dv._getSchemaDict(domain, schema, resolveRefs, key)

        this.assertEqual(expected, result)
        this.assertEqual(domain.spy.getVariableByName.count, 0)
    }

    @targets('_getSchemaDict')
    @desc('_getSchemaDict adds refered schemas to dict')
    testGetSchemaDictWithReferences() {
        const dv = this.__init()
        const domain = new EnvironmentDomainMock()
        const schema = {
            $ref: '#/definitions/count'
        }
        const resolveRefs = true
        const key = '@undefined'

        const variable = this.__createSchemaVariable({
            type: 'integer',
            minimum: 3,
            maximum: 4
        })
        const references = {
            '#/definitions/count': variable
        }

        domain.spyOn('getVariableByName', (name) => {
            return references[name]
        })

        const expected = {
            '@undefined': schema,
            '#/definitions/count': {
                type: 'integer',
                minimum: 3,
                maximum: 4
            }
        }

        const result = dv._getSchemaDict(domain, schema, resolveRefs, key)

        this.assertEqual(expected, result)
        this.assertEqual(domain.spy.getVariableByName.count, 1)
    }

    @targets('_getSchemaDict')
    @desc('_getSchemaDict adds all refered schemas to dict')
    testGetSchemaDictWithReferencesInReferences() {
        const dv = this.__init()
        const domain = new EnvironmentDomainMock()
        const schema = {
            $ref: '#/definitions/middle'
        }
        const resolveRefs = true
        const key = '@undefined'

        const variable = this.__createSchemaVariable({
            $ref: '#/definitions/count'
        })
        const final = this.__createSchemaVariable({
            type: 'integer',
            minimum: 3,
            maximum: 4
        })
        const references = {
            '#/definitions/middle': variable,
            '#/definitions/count': final
        }

        domain.spyOn('getVariableByName', (name) => {
            return references[name]
        })

        const expected = {
            '@undefined': schema,
            '#/definitions/middle': {
                $ref: '#/definitions/count'
            },
            '#/definitions/count': {
                type: 'integer',
                minimum: 3,
                maximum: 4
            }
        }

        const result = dv._getSchemaDict(domain, schema, resolveRefs, key)

        this.assertEqual(expected, result)
        this.assertEqual(domain.spy.getVariableByName.count, 2)
    }

    @targets('_getSchemaDict')
    @desc('_getSchemaDict checks each schema only once')
    testGetSchemaDictWithCircularReferences() {
        const dv = this.__init()
        const domain = new EnvironmentDomainMock()
        const schema = {
            $ref: '#/definitions/middle'
        }
        const resolveRefs = true
        const key = '@undefined'

        const variable = this.__createSchemaVariable({
            properties: {
                count: {
                    $ref: '#/definitions/count'
                },
                self : {
                    $ref: '#/definitions/middle'
                }
            }
        })
        const final = this.__createSchemaVariable({
            type: 'integer',
            minimum: 3,
            maximum: 4
        })
        const references = {
            '#/definitions/middle': variable,
            '#/definitions/count': final
        }

        domain.spyOn('getVariableByName', (name) => {
            return references[name]
        })

        const expected = {
            '@undefined': schema,
            '#/definitions/middle': {
                properties: {
                    count: {
                        $ref: '#/definitions/count'
                    },
                    self : {
                        $ref: '#/definitions/middle'
                    }
                }
            },
            '#/definitions/count': {
                type: 'integer',
                minimum: 3,
                maximum: 4
            }
        }

        const result = dv._getSchemaDict(domain, schema, resolveRefs, key)

        this.assertEqual(expected, result)
        this.assertEqual(domain.spy.getVariableByName.count, 3)
    }

    @targets('_getSchemaDict')
    @desc('_getSchemaDict removes occurences to missing schemas')
    testGetSchemaDictWithMissingReferences() {
        const dv = this.__init()
        const domain = new EnvironmentDomainMock()
        const schema = {
            $ref: '#/definitions/middle'
        }
        const resolveRefs = true
        const key = '@undefined'

        const variable = this.__createSchemaVariable({
            properties: {
                count: {
                    $ref: '#/definitions/count'
                },
                self : {
                    $ref: '#/definitions/middle'
                },
                missing: {
                    $ref: '#/definitions/missing'
                }
            }
        })
        const final = this.__createSchemaVariable({
            type: 'integer',
            minimum: 3,
            maximum: 4,
            properties: {
                missing: {
                    $ref: '#/definitions/missing'
                }
            }
        })
        const references = {
            '#/definitions/middle': variable,
            '#/definitions/count': final
        }

        domain.spyOn('getVariableByName', (name) => {
            return references[name]
        })

        const expected = {
            '@undefined': schema,
            '#/definitions/middle': {
                properties: {
                    count: {
                        $ref: '#/definitions/count'
                    },
                    self : {
                        $ref: '#/definitions/middle'
                    },
                    missing: {}
                }
            },
            '#/definitions/count': {
                type: 'integer',
                minimum: 3,
                maximum: 4,
                properties: {
                    missing: {}
                }
            }
        }

        const result = dv._getSchemaDict(domain, schema, resolveRefs, key)

        this.assertEqual(expected, result)
        this.assertEqual(domain.spy.getVariableByName.count, 5)
    }

    @targets('_findReferences')
    @desc('_findReferences returns empty list for a simple schema')
    testFindReferencesReturnsEmptyListWithSimpleSchema() {
        const dv = this.__init()
        const schema = {
            type: 'integer',
            minimum: 3,
            maximum: 4,
            properties: {
                value: 42
            }
        }

        const expected = []
        const result = dv._findReferences(schema)

        this.assertEqual(expected, result)
    }

    @targets('_findReferences')
    @desc('_findReferences returns all references')
    testFindReferencesReturnsAllReferences() {
        const dv = this.__init()
        const schema = {
            type: 'integer',
            minimum: 3,
            maximum: 4,
            properties: {
                value: 42,
                count: {
                    $ref: '#/definitions/count'
                },
                user: {
                    $ref: '#/definitions/user'
                }
            }
        }

        const expected = [ '#/definitions/count', '#/definitions/user' ]
        const result = dv._findReferences(schema)

        this.assertEqual(expected, result)
    }

    @targets('_deleteReferences')
    @desc('_deleteReferences leaves simple schema intact')
    testdeleteReferencesDoesNotModifySimpleSchema() {
        const dv = this.__init()
        const schema = {
            type: 'integer',
            minimum: 3,
            maximum: 4,
            properties: {
                value: 42
            }
        }

        const expected = schema
        const result = dv._deleteReferences(schema)

        this.assertEqual(expected, result)
    }

    @targets('_deleteReferences')
    @desc('_deleteReferences removes all references')
    testDeleteReferencesRemovesAllReferences() {
        const dv = this.__init()
        const schema = {
            type: 'integer',
            minimum: 3,
            maximum: 4,
            properties: {
                value: 42,
                count: {
                    $ref: '#/definitions/count'
                },
                user: {
                    $ref: '#/definitions/user'
                }
            }
        }

        const expected = {
            type: 'integer',
            minimum: 3,
            maximum: 4,
            properties: {
                value: 42,
                count: {},
                user: {}
            }
        }
        const result = dv._deleteReferences(schema)

        this.assertEqual(expected, result)
    }

    @targets('_deleteReferences')
    @desc('_deleteReferences removes only references in list')
    testDeleteReferencesRemovesOnlyReferencesFromList() {
        const dv = this.__init()
        const schema = {
            type: 'integer',
            minimum: 3,
            maximum: 4,
            properties: {
                value: 42,
                count: {
                    $ref: '#/definitions/count'
                },
                user: {
                    $ref: '#/definitions/user'
                }
            }
        }
        const deleteList = [ '#/definitions/user' ]

        const expected = {
            type: 'integer',
            minimum: 3,
            maximum: 4,
            properties: {
                value: 42,
                count: {
                    $ref: '#/definitions/count'
                },
                user: {}
            }
        }
        const result = dv._deleteReferences(schema, deleteList)

        this.assertEqual(expected, result)
    }

    @targets('_materializeSchemas')
    @desc('_materializeSchemas creates reference tree')
    testMaterializeSchemasCreatesReferenceTree() {
        const dv = this.__init()
        const schemaDict = {
            '#/definitions/count': {
                type: 'integer',
                minimum: 3,
                maximum: 4,
            },
            '#/definitions/user': {
                properties: {
                    value: 42,
                    count: {
                        $ref: '#/definitions/count'
                    },
                    user: {
                        $ref: '#/definitions/user'
                    }
                }
            },
            '#/random': {
                type: 'string'
            },
            '#/random/ly/deeply/nested': {
                type: 'number'
            }
        }

        const expected = {
            definitions: {
                count: {
                    type: 'integer',
                    minimum: 3,
                    maximum: 4,
                },
                user: {
                    properties: {
                        value: 42,
                        count: {
                            $ref: '#/definitions/count'
                        },
                        user: {
                            $ref: '#/definitions/user'
                        }
                    }
                }
            },
            random: {
                type: 'string',
                ly: {
                    deeply: {
                        nested: {
                            type: 'number'
                        }
                    }
                }
            }
        }
        const result = dv._materializeSchemas(schemaDict)

        this.assertEqual(expected, result)
    }

    __init(schema, resolveRefs = true, domainName) {
        const dv = new ClassMock(new JSONSchemaFakerDynamicValue(domainName))
        dv.schema = schema
        dv.resolveRefs = resolveRefs

        return dv
    }

    __createSchemaVariable(schema) {
        const variable = new EnvironmentVariableMock()
        const content = new JSONSchemaFakerDynamicValue()

        content.schema = schema
        content.type = JSONSchemaFakerDynamicValue.identifier

        const dynS = new DynamicString(content)

        variable.spyOn('getCurrentValue', () => {
            return dynS
        })

        return variable
    }
}
