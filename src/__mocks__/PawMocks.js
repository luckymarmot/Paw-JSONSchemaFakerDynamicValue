import { Mock } from './Mocks'

export class PawContextMock extends Mock {
    constructor(baseObj, prefix) {
        let obj = {
            getCurrentRequest: () => {},
            getRequestByName: () => {},
            getRequestGroupByName: () => {},
            getRootRequestTreeItems: () => {},
            getRootRequests: () => {},
            getAllRequests: () => {},
            getAllGroups: () => {},
            getEnvironmentDomainByName: () => {},
            getEnvironmentVariableByName: () => {},
            getRequestById: () => {},
            getRequestGroupById: () => {},
            getEnvironmentDomainById: () => {},
            getEnvironmentVariableById: () => {},
            getEnvironmentById: () => {},
            createRequest: () => {},
            createRequestGroup: () => {},
            createEnvironmentDomain: () => {}
        }
        Object.assign(obj, baseObj)
        super(obj, prefix)
    }
}

export class EnvironmentDomainMock extends Mock {
    constructor(baseObj, prefix) {
        let obj = {
            getEnvironmentByName: () => {},
            getVariableByName: () => {},
            createEnvironment: () => {}
        }
        Object.assign(obj, baseObj)
        super(obj, prefix)
    }
}

export class EnvironmentVariableMock extends Mock {
    constructor(baseObj, prefix) {
        let obj = {
            getCurrentValue: () => {},
            getValue: () => {},
            setCurrentValue: () => {},
            setValue: () => {}
        }
        Object.assign(obj, baseObj)
        super(obj, prefix)
    }
}

export class InputField extends Mock {
    constructor(key, name, type, options, prefix = '') {
        let obj = {
            key: key,
            name: name,
            type: type,
            options: options
        }
        super(obj, prefix)
    }
}

export class DynamicString extends Mock {
    constructor(...items) {
        let obj = {
            length: null,
            components: items,
            toString: () => {},
            getComponentAtIndex: () => {},
            getSimpleString: () => {},
            getOnlyString: () => {},
            getOnlyDynamicValue: () => {},
            getEvaluatedString: () => {},
            copy: () => {},
            appendString: () => {},
            appendDynamicValue: () => {},
            appendDynamicString: () => {}
        }
        super(obj)
    }
}

export const registerDynamicValueClass = (_class) => {
    return _class
}
