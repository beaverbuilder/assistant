import React, { useContext } from 'react'
import {
	Button,
	Icon,
	Separator,
	AppTabButton,
	UIContext,
} from 'components'
import { NotificationsAppButton } from 'apps/fl-notifications/button'
import { App, useAppsMenu, AppFrame } from 'system'
import { useWindowSize } from 'utils/window'
import './style.scss'

/**
 * Main UI Controller
 */
export const UI = () => {
	const {
		apps,
		activeApp,
		activeAppName,
		setActiveApp,
		setIsShowingUI,
		renderModals,
	} = useContext( UIContext )
	const { width } = useWindowSize()

	const { isShowingAppsMenu, toggleIsShowingAppsMenu } = useAppsMenu()

	const excludedApps = [ 'fl-notifications' ]
	const maxTabCount = 400 < width ? 4 : 2
	let count = 0

	return (
		<AppFrame>
			<div className="fl-asst-panel-wrap">

				{ /* Toolbar */ }
				<div className="fl-asst-panel-chrome">
					<div className="fl-asst-panel-chrome-area">
						<NotificationsAppButton isShowingAppsMenu={isShowingAppsMenu} />
					</div>
					<div className="fl-asst-app-tabs-wrap">
						<div className="fl-asst-app-tabs-area">
							{ Object.keys( apps ).map( key => {

								if ( excludedApps.includes( key ) ) {
									return null
								}

								if ( count >= maxTabCount ) {
									return null
								}
								count++

								const tab = apps[key]
								const isSelected = ( key === activeAppName && ! isShowingAppsMenu ) ? true : false

								if ( false === tab.enabled ) {
									return null
								}

								if ( 'function' !== typeof tab.icon ) {
									tab.icon = props => <Icon name="default-app" {...props} />
								}

								return (
									<AppTabButton key={key} isSelected={isSelected} onClick={() => setActiveApp( key )} tooltip={tab.label}>
										{tab.icon( { key, isSelected } )}
									</AppTabButton>
								)
							} ) }

							<AppTabButton appearance="icon" isSelected={isShowingAppsMenu} onClick={toggleIsShowingAppsMenu}>
								<Icon name="apps-app" />
							</AppTabButton>
						</div>
					</div>
					<div className="fl-asst-panel-chrome-area">
						<Button onClick={ () => setIsShowingUI( false ) } appearance="icon">
							<Icon name="close" />
						</Button>
					</div>
				</div>

				<Separator isSlim={true} />

				<div className="fl-asst-panel-contents">
					<App key={activeAppName} {...activeApp} />
				</div>
			</div>

			{ renderModals() }
		</AppFrame>
	)
}

/**
 * Button To Show/Hide The UI
 */
export const ShowUITrigger = () => {
	const { isShowingUI, setIsShowingUI } = useContext( UIContext )

	const styles = {
		position: 'fixed',
		right: 0,
		bottom: 0,
		padding: 10,
		zIndex: 999,
	}
	const buttonStyles = {
		borderRadius: '8px'
	}
	return (
		<div style={styles}>
			<Button
				id="fl-asst-trigger"
				onClick={ () => setIsShowingUI( true ) } style={buttonStyles} isSelected={true}

				aria-label="Assistant Panel"
				aria-expanded={ isShowingUI ? 'false' : 'true' }
			>
				<Icon name="trigger-button"/>
			</Button>
		</div>
	)
}
