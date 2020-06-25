import * as actions from '../actions'

describe( 'actions', () => {
	describe( 'registerApp', () => {
		it( 'should return the REGISTER_APP action', () => {
			expect( actions.registerApp( 'test', {} ) ).toEqual( {
				type: 'REGISTER_APP',
				key: 'test',
				config: {},
			} )
		} )
	} )
} )
