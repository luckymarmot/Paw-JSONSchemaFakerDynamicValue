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

export class InputField extends Mock {
    constructor(key, name, type, options, prefix = '') {
        let obj = {
            key: key,
            name: name,
            type: type,
            options: options
        }
        Object.assign(obj, baseObj)
        super(obj, prefix)
    }
}

export const registerDynamicValueClass = (_class) => {
    return _class
}
