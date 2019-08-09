import React, { useContext } from 'react'
import { TunnelProvider } from 'react-tunnels'
import {
	Button,
	Icon,
	AppTabButton,
	UIContext,
	AppContext,
} from 'components'
import { NotificationsAppButton } from 'apps/fl-notifications/button'
import { App, useAppsMenu, AppFrame, AppHeader, OuterErrorBoundary } from 'system'
import { useWindowSize } from 'shared-utils/window'
import { render } from 'shared-utils/react'
import { useSystemState } from 'store'
import './style.scss'

/**
 * Main UI Controller
 */
export const UI = () => {
	const { appOrder, apps } = useSystemState()
	const {
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
	let activeAppIsBelowFold = false

	const onClickApp = key => {
		setActiveApp( key )
	}

	const appContext = { ...activeApp }

	return (
		<TunnelProvider>
			<AppContext.Provider value={ appContext }>
				<AppFrame>
					<OuterErrorBoundary>
						<div className="fl-asst-panel-wrap">

							<div className="fl-asst-panel-header">
								<div className="fl-asst-panel-chrome">
									<div className="fl-asst-panel-chrome-area">
										<NotificationsAppButton isShowingAppsMenu={ isShowingAppsMenu } />
									</div>
									<div className="fl-asst-app-tabs-wrap">
										<div className="fl-asst-app-tabs-area">
											{ appOrder.map( key => {
												const app = apps[key]

												if ( key === activeAppName && count >= maxTabCount && ! excludedApps.includes( key ) ) {
													activeAppIsBelowFold = true
												}

												if ( 'undefined' === typeof app ) {
													return null
												} else if ( excludedApps.includes( key ) ) {
													return null
												} else if ( count >= maxTabCount ) {
													return null
												} else if ( false === app.enabled ) {
													return null
												}
												count++

												const isSelected = ( key === activeAppName && ! isShowingAppsMenu )

												// Render if it's a JSX literal or function (else null)
												let icon = render( app.icon )
												if ( ! icon ) {
													icon = <Icon name="default-app" />
												}

												return (
													<AppTabButton
														key={ key }
														isSelected={ isSelected }
														onClick={ e => onClickApp( key, e ) }
														tooltip={ app.label }
													>{ icon }</AppTabButton>
												)
											} ) }

											<AppTabButton
												appearance="icon"
												isSelected={ isShowingAppsMenu || activeAppIsBelowFold }
												onClick={ toggleIsShowingAppsMenu }
												tooltip="Apps"
											>
												<Icon name="apps-app" />
											</AppTabButton>
										</div>
									</div>
									<div className="fl-asst-panel-chrome-area">
										<Button onClick={ () => setIsShowingUI( false ) } appearance="icon">
											<Icon name="close" />
										</Button>
									</div>
								</div>{ /* chrome */ }

								{ 'undefined' !== typeof activeApp && <AppHeader key={ activeAppName } /> }
							</div>

							<div className="fl-asst-panel-contents">
								<App key={ activeAppName } { ...activeApp } />
							</div>
						</div>

						{ renderModals() }

					</OuterErrorBoundary>
				</AppFrame>
			</AppContext.Provider>
		</TunnelProvider>
	)
}
