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
	const { showUI, apps, activeApp, panelPosition } = useStore()
	const { setActiveApp, togglePanelPosition, setPanelPosition } = useDispatch()

	// Create a toggle function to show/hide the panel
	const toggleUI = () => showUI ? setShowUI( false ) : setShowUI( true )

	const ui = {
		isShowingUI: showUI,
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
					<ShowUITrigger onClick={toggleUI} />

					{/* This is the panel itself */}
					<UI isShowing={showUI} toggleUI={toggleUI} />
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
