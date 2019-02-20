import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { UI, ShowUITrigger } from './ui'
import { UIContext, PageViewContext, useModals } from 'components'
import { useActiveApp } from 'system'
import { getConfig, useStore, getStore, getDispatch } from 'store'
import { redirect } from 'utils/location'
import './api'
import './apps'

/**
 * The Root Component
 */
const Assistant = () => {

	const { currentPageView } = getConfig()
	const { isShowingUI, apps, panelPosition, appFrameSize, } = useStore()
	const {
		setIsShowingUI,
		togglePanelPosition,
		setPanelPosition,
		setIsShowingAppsMenu,
		setAppFrameSize,
	} = getDispatch()
	const { activeApp, activeAppName, setActiveApp } = useActiveApp()

	const { renderModals, presentModal, dismissModal, presentNotification, modalExists } = useModals()

	// Create a toggle function to show/hide the panel
	const toggleIsShowingUI = () => isShowingUI ? setIsShowingUI( false ) : setIsShowingUI( true )

	const activateApp = name => {
		setActiveApp( name )
		dismissModal( 'fl-apps' )
		setIsShowingAppsMenu( false )
	}

	// Create a store-bound value object for UIContext.Provider
	const ui = {
		isShowingUI,
		setIsShowingUI,
		toggleIsShowingUI,

		apps,

		activeApp,
		activeAppName,
		setActiveApp: activateApp,

		appFrameSize,
		setAppFrameSize,

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
		<Provider store={getStore()}>
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

render( <Assistant />, root )
