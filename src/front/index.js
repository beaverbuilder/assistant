import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { UI, ShowUITrigger } from './ui'
import { UIContext, PageViewContext, useModals } from 'components'
import { useActiveApp, hooks, HooksContext } from 'system'
import store, { useConfig, useStore, useDispatch } from 'store'
import { redirect } from 'utils/location'
import './api'
import './apps'

/**
 * The Root Component
 */
const Assistant = () => {

	const { currentPageView } = useConfig()
	const { isShowingUI, apps, panelPosition } = useStore()
	const {
		setIsShowingUI,
		togglePanelPosition,
		setPanelPosition,
	} = useDispatch()
	const { activeApp, activeAppName, setActiveApp } = useActiveApp()

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
		activeAppName,
		setActiveApp,

		panelPosition,
		togglePanelPosition,
		setPanelPosition,

		presentModal,
		dismissModal,
		renderModals,
		modalExists,
		presentNotification,

		goToURL: redirect,
	}

	return (
		<Provider store={store}>
			<UIContext.Provider value={ui}>
				<PageViewContext.Provider value={currentPageView}>
					{ ! isShowingUI && <ShowUITrigger /> }
					<UI />
				</PageViewContext.Provider>
			</UIContext.Provider>
		</Provider>
	)
}

// Render App into the document
const root = document.createElement( 'div' )
root.classList.add( 'fl-asst' )
document.body.appendChild( root )

render(
	<HooksContext.Provider value={hooks}>
		<Assistant />
	</HooksContext.Provider>
	, root )
