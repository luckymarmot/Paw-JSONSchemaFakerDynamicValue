import {
	UnitTest, registerTest, against
} from '../../__utils__/TestUtils'

import {
	Mock
} from '../Mocks'

@registerTest
@against(Mock)
export class TestMock extends UnitTest {
    testSimpleMock() {
        let mock = new Mock()

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', 'spyOn', 'getSpy' ]
        )
        this.assertEqual(mock.spy, {})
    }

    testSimpleObjectMock() {
        let mock = new Mock({
            a: 12
        })

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', 'a', 'spyOn', 'getSpy' ]
        )
        this.assertEqual(mock.spy, {})
    }

    testSimpleObjectWithFuncMock() {
        let obj = {
            a: (arg) => {
                return arg * arg
            }
        }

        let mock = new Mock(obj)

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', 'a', 'spyOn', 'getSpy' ]
        )
        this.assertEqual(Object.keys(mock.spy), [ 'a' ])
    }

    testSimpleObjectWithFuncAndVarsMock() {
        let obj = {
            a: (arg) => {
                return arg * arg
            },
            b: true
        }

        let mock = new Mock(obj)

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', 'a', 'b', 'spyOn', 'getSpy' ]
        )
        this.assertEqual(Object.keys(mock.spy), [ 'a' ])
    }

    testSpyOn() {
        let obj = {
            a: (arg) => {
                return arg * arg
            }
        }

        let mock = new Mock(obj)

        mock.spyOn(
            'a',
            (arg) => {
                return arg * 2
            }
        )

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', 'a', 'spyOn', 'getSpy' ]
        )

        let expected = 6
        mock.a(10)
        let result = mock.a(3)
        this.assertEqual(mock.spy.a.count, 2)
        this.assertEqual(mock.spy.a.calls, [ [ 10 ], [ 3 ] ])
        this.assertEqual(result, expected)
    }

    testGetSpy() {
        let obj = {
            a: (arg) => {
                return arg * arg
            }
        }

        let mock = new Mock(obj)

        mock.spyOn(
            'a',
            (arg) => {
                return arg * 2
            }
        )

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', 'a', 'spyOn', 'getSpy' ]
        )

        mock.a(10)
        mock.a(3)

        this.assertEqual(mock.getSpy('a').count, 2)
        this.assertEqual(mock.getSpy('a').calls, [ [ 10 ], [ 3 ] ])
    }

    testMultipleSpies() {
        let obj = {
            a: (arg) => {
                return arg * arg
            },
            b: (key, value) => {
                let result = {}
                result[value] = key
                return result
            }
        }

        let mock = new Mock(obj)

        mock
            .spyOn(
                'a',
                (arg) => {
                    return arg * 2
                }
            )
            .spyOn(
                'b',
                (k, v) => {
                    return k + ',' + v
                }
            )

        mock.a(10)
        mock.b(3, 10)

        this.assertEqual(mock.getSpy('a').count, 1)
        this.assertEqual(mock.getSpy('a').calls, [ [ 10 ] ])

        this.assertEqual(mock.getSpy('b').count, 1)
        this.assertEqual(mock.getSpy('b').calls, [ [ 3, 10 ] ])
    }

    testPrefix() {
        let obj = {
            a: (arg) => {
                return arg * arg
            },
            b: true
        }

        let mock = new Mock(obj, '__')

        this.assertEqual(
            Object.keys(mock),
            [ '__spy', 'a', 'b', '__spyOn', '__getSpy' ]
        )
        this.assertEqual(Object.keys(mock.__spy), [ 'a' ])

        // no prefix
        mock = new Mock(obj, '')

        this.assertEqual(
            Object.keys(mock),
            [ 'spy', 'a', 'b', 'spyOn', 'getSpy' ]
        )
        this.assertEqual(Object.keys(mock.spy), [ 'a' ])
    }
}
