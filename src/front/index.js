import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { UI, ShowUITrigger } from './ui'
import { UIContext } from 'components'
import store, { useStore, useDispatch } from 'store'
import './api'
import './apps'

/**
 * The Root Component
 */
const App = () => {
	const { isShowingUI, apps, activeApp, panelPosition } = useStore()
	const { setIsShowingUI, setActiveApp, togglePanelPosition, setPanelPosition } = useDispatch()

	// Create a toggle function to show/hide the panel
	const toggleIsShowingUI = () => isShowingUI ? setIsShowingUI( false ) : setIsShowingUI( true )

	const ui = {
		isShowingUI,
		setIsShowingUI,
		toggleIsShowingUI,
		activeApp,
		setActiveApp,
		panelPosition,
		togglePanelPosition,
		setPanelPosition,
	}

	return (
		<StrictMode>
			<Provider store={store}>
				<UIContext.Provider value={ui}>
					{/* This is the button that toggles the UI panel */}
					<ShowUITrigger />

					{/* This is the panel itself */}
					<UI />
				</UIContext.Provider>
			</Provider>
		</StrictMode>
	)
}

// Render App into the document
const root = document.createElement( 'div' )
root.classList.add( 'fl-asst' )
document.body.appendChild( root )

render( <App />, root )
