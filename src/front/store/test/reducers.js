import {
	activeApp,
	apps,
} from '../reducers'

describe( 'reducers', () => {
	describe( 'activeApp', () => {
		it( 'should return the active app key', () => {
			const state = 'foo'
			const action = {
				type: 'SET_ACTIVE_APP',
				key: 'bar',
			}
			expect( activeApp( state, action ) ).toEqual( 'bar' )
		} )
	} )

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
			expect( apps( state, action ) ).toEqual( {
				foo: expect.any( Object ),
				bar: expect.any( Object ),
			} )
		} )
	} )
} )
