import { UnitTest, registerTest, against } from '../../__utils__/TestUtils'

import {
	PawContextMock,
    InputField
} from '../PawMocks'

@registerTest
@against(PawContextMock)
export class TestPawContextMock extends UnitTest {
    testEmptyPawContextMock() {
        const pawContextFields = [
            'getCurrentRequest',
            'getRequestByName',
            'getRequestGroupByName',
            'getRootRequestTreeItems',
            'getRootRequests',
            'getAllRequests',
            'getAllGroups',
            'getEnvironmentDomainByName',
            'getEnvironmentVariableByName',
            'getRequestById',
            'getRequestGroupById',
            'getEnvironmentDomainById',
            'getEnvironmentVariableById',
            'getEnvironmentById',
            'createRequest',
            'createRequestGroup',
            'createEnvironmentDomain'
        ]

        const mock = new PawContextMock(null)

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', ...pawContextFields, 'spyOn', 'getSpy' ]
        )

        this.assertEqual(Object.keys(mock.spy), pawContextFields)
    }
}

@registerTest
@against(InputField)
export class TestInputFieldMock extends UnitTest {
    testSimpleInputFieldMock() {
        const pawInputFieldFields = []

        const mock = new InputField('name', 'Name', 'Checkbox', { a: 12 })

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', 'key', 'name', 'type', 'options', 'spyOn', 'getSpy' ]
        )

        this.assertEqual(Object.keys(mock.spy), pawInputFieldFields)
    }
}
