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

	describe( 'setActiveApp', () => {
		it( 'should return the SET_ACTIVE_APP action', () => {
			expect( actions.setActiveApp( 'test' ) ).toEqual( {
				type: 'SET_ACTIVE_APP',
				key: 'test',
			} )
		} )
	} )

	describe( 'hydrateAppState', () => {
		it( 'should return the HYDRATE_APP_STATE action', () => {
			expect( actions.hydrateAppState( 'test', {} ) ).toEqual( {
				type: 'HYDRATE_APP_STATE',
				app: 'test',
				state: {},
			} )
		} )
	} )

	describe( 'setAppState', () => {
		it( 'should return the SET_APP_STATE action', () => {
			expect( actions.setAppState( 'test', 'foo', 'bar' ) ).toEqual( {
				type: 'SET_APP_STATE',
				app: 'test',
				key: 'foo',
				value: 'bar',
			} )
		} )
	} )

	describe( 'setIsShowingUI', () => {
		it( 'should return the SET_SHOW_UI action', () => {
			expect( actions.setIsShowingUI( true ) ).toEqual( {
				type: 'SET_SHOW_UI',
				show: true,
			} )
		} )
	} )

	describe( 'setPanelPosition', () => {
		it( 'should return the SET_PANEL_POSITION action', () => {
			expect( actions.setPanelPosition( 'start' ) ).toEqual( {
				type: 'SET_PANEL_POSITION',
				position: 'start',
			} )
		} )
	} )

	describe( 'togglePanelPosition', () => {
		it( 'should return the TOGGLE_PANEL_POSITION action', () => {
			expect( actions.togglePanelPosition() ).toEqual( {
				type: 'TOGGLE_PANEL_POSITION',
			} )
		} )
	} )
} )
