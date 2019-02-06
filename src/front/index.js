import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { UI, ShowUITrigger } from './ui'
import { UIContext, PageViewContext } from 'components'
import store, { useStore, useDispatch } from 'store'
import './api'
import './apps'

/**
 * The Root Component
 */
const App = () => {
	const { isShowingUI, activeApp, panelPosition, currentPageView } = useStore()
	const { setIsShowingUI, setActiveApp, togglePanelPosition, setPanelPosition } = useDispatch()

	// Create a toggle function to show/hide the panel
	const toggleIsShowingUI = () => isShowingUI ? setIsShowingUI( false ) : setIsShowingUI( true )

	const goToURL = url => {
		window.location = url
	}

	// Create a store-bound value object for UIContext.Provider
	const ui = {
		isShowingUI,
		setIsShowingUI,
		toggleIsShowingUI,
		activeApp,
		setActiveApp,
		panelPosition,
		togglePanelPosition,
		setPanelPosition,
		goToURL,
	}

	return (
		<StrictMode>
			<Provider store={store}>
				<UIContext.Provider value={ui}>
					<PageViewContext.Provider value={currentPageView}>
						{/* This is the button that toggles the UI panel */}
						{ ! isShowingUI && <ShowUITrigger /> }

						{/* This is the panel itself */}
						<UI />
					</PageViewContext.Provider>
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
