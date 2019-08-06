import * as reducers from '../reducers'

describe( 'reducers', () => {
	describe( 'apps', () => {
		it( 'should register a new app', () => {
			const state = {
				foo: {},
			}
			const action = {
				type: 'REGISTER_APP',
				key: 'bar',
				config: {},
			}
			expect( reducers.apps( state, action ) ).toEqual( {
				foo: expect.any( Object ),
				bar: expect.any( Object ),
			} )
		} )
	} )
} )
