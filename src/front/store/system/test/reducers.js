import * as reducers from '../reducers'

describe( 'reducers', () => {
	describe( 'activeApp', () => {
		it( 'should return the active app key', () => {
			const state = 'foo'
			const action = {
				type: 'SET_ACTIVE_APP',
				key: 'bar',
			}
			expect( reducers.activeApp( state, action ) ).toEqual( 'bar' )
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
			expect( reducers.apps( state, action ) ).toEqual( {
				foo: expect.any( Object ),
				bar: expect.any( Object ),
			} )
		} )
	} )

	describe( 'isShowingUI', () => {
		it( 'should show the UI', () => {
			const state = false
			const action = {
				type: 'SET_SHOW_UI',
				show: true,
			}
			expect( reducers.isShowingUI( state, action ) ).toEqual( true )
		} )
	} )

	describe( 'panelPosition', () => {
		it( 'should toggle the panel position', () => {
			const state = 'start'
			const action = {
				type: 'TOGGLE_PANEL_POSITION',
			}
			expect( reducers.panelPosition( state, action ) ).toEqual( 'end' )
		} )

		it( 'should set the panel position', () => {
			const state = 'start'
			const action = {
				type: 'SET_PANEL_POSITION',
				position: 'end',
			}
			expect( reducers.panelPosition( state, action ) ).toEqual( 'end' )
		} )
	} )
} )
