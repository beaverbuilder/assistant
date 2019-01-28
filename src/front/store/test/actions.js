import {
	registerApp,
	setActiveApp,
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
} )
