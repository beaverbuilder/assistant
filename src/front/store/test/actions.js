import {
	registerApp,
	setActiveApp,
	hydrateAppState,
} from '../actions'

describe( 'actions', () => {
	describe( 'registerApp', () => {
		it( 'should return the REGISTER_APP action', () => {
			expect( registerApp( 'test', {} ) ).toEqual( {
				type: 'REGISTER_APP',
				key: 'test',
				config: {},
			} )
		} )
	} )

	describe( 'setActiveApp', () => {
		it( 'should return the SET_ACTIVE_APP action', () => {
			expect( setActiveApp( 'test' ) ).toEqual( {
				type: 'SET_ACTIVE_APP',
				key: 'test',
			} )
		} )
	} )

	describe( 'hydrateAppState', () => {
		it( 'should return the HYDRATE_APP_STATE action', () => {
			expect( hydrateAppState( 'test' ) ).toEqual( {
				type: 'HYDRATE_APP_STATE',
				key: 'test',
			} )
		} )
	} )
} )
