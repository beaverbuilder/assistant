import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { UI } from './ui'
import { UIToggleButton, useActiveApp } from 'system'
import {
	UIContext,
	PageViewContext,
	useModals
} from 'components'
import {
	getSystemConfig,
	getSystemStore,
	getSystemActions,
	useSystemState
} from 'store'
import { redirect } from 'shared-utils/location'

Provider.displayName = 'StoreProvider'

/**
 * The Root Component
 */
const Assistant = () => {
	const { currentPageView } = getSystemConfig()
	const { isShowingUI, panelPosition, appFrameSize } = useSystemState()

	const {
		setIsShowingUI,
		togglePanelPosition,
		setPanelPosition,
		setIsShowingAppsMenu,
		setAppFrameSize,
	} = getSystemActions()

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
		<Provider store={ getSystemStore() }>
			<UIContext.Provider value={ ui }>
				<PageViewContext.Provider value={ currentPageView }>
					<ReactCSSTransitionGroup
						transitionName="display"
						transitionEnterTimeout={ 2000 }
						transitionLeaveTimeout={ 2000 }
					>
						{ ! isShowingUI && <UIToggleButton key="button" /> }
						{ isShowingUI && <UI key="panel" /> }
					</ReactCSSTransitionGroup>
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
