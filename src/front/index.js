import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { UI, ShowUITrigger } from './ui'
import { UIContext, PageViewContext, useModals, useAppFrame } from 'components'
import { useAppsMenu } from 'system'
import { goToURL } from 'utils/url'
import store, { useConfig, useStore, useDispatch } from 'store'
import './api'
import './apps'

/**
 * The Root Component
 */
const App = () => {
	const { currentPageView } = useConfig()
	const { isShowingUI, apps, activeApp, panelPosition } = useStore()
	const { setIsShowingUI, setActiveApp, togglePanelPosition, setPanelPosition } = useDispatch()
	const { appFrame, setAppFrameSize } = useAppFrame()
	const { renderModals, presentModal, dismissModal, presentNotification, modalExists } = useModals()

	// Create a toggle function to show/hide the panel
	const toggleIsShowingUI = () => isShowingUI ? setIsShowingUI( false ) : setIsShowingUI( true )

	// Create a store-bound value object for UIContext.Provider
	const ui = {
		isShowingUI,
		setIsShowingUI,
		toggleIsShowingUI,

		apps,
		activeApp,
		setActiveApp,

		appFrame,
		setAppFrameSize,

		panelPosition,
		togglePanelPosition,
		setPanelPosition,

		presentModal,
		dismissModal,
		renderModals,
		modalExists,
		presentNotification,

		goToURL,
	}

	return (
		<StrictMode>
			<Provider store={store}>
				<UIContext.Provider value={ui}>
					<PageViewContext.Provider value={currentPageView}>
						{ ! isShowingUI && <ShowUITrigger /> }
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
