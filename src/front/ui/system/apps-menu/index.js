import React, { Fragment, useContext } from 'react'
import { useSystemState, getSystemActions } from 'store'
import { Heading, Icon, UIContext, Button } from 'components'
import './style.scss'

const AppsMenu = () => {
	const { apps, order } = useSystemState()
	const { setAppPosition } = getSystemActions()
	const { setActiveApp } = useContext( UIContext )

	const excludedApps = [ 'fl-notifications' ]

	const clickItem = key => {
		setActiveApp( key )
	}

	return (
		<Fragment>
			<Heading className="fl-asst-manage-apps-title">Apps</Heading>
			<div className="fl-asst-app-list">
				{ order.map( ( key, position ) => {

					if ( excludedApps.includes( key ) ) {
						return null
					}

					const app = apps[key]

					if ( false === app.enabled ) {
						return null
					}

					if ( 'function' !== typeof app.icon ) {
						app.icon = props => <Icon name="default-app" {...props} />
					}

					if ( 'function' !== typeof app.settings ) {
						app.settings = () => null
					}

					const moveUp = e => {
						setAppPosition( key, position - 1 )
						e.stopPropagation()
					}
					const moveDown = e => {
						setAppPosition( key, position + 1 )
						e.stopPropagation()
					}

					return (
						<div className="fl-asst-app-list-item" key={key} onClick={ () => clickItem( key ) }>
							{ app.icon() }
							<div className="fl-asst-app-list-item-title">
								{app.label}

								<div style={{ marginLeft: 'auto' }}>
									{ position > 0 && <Button onClick={moveUp}>Up</Button> }
									{ position < order.length && <Button onClick={moveDown}>down</Button> }
								</div>
							</div>
						</div>
					)
				} )}
			</div>
		</Fragment>
	)
}

export const useAppsMenu = () => {
	const { isShowingAppsMenu } = useSystemState()
	const { setIsShowingAppsMenu } = getSystemActions()
	const { presentModal, dismissModal } = useContext( UIContext )
	const modalID = 'fl-apps'

	const showAppsMenu = () => {
		presentModal( <AppsMenu />, {
			id: modalID,
			appearance: 'menu',
			onDismiss: () => {
				setIsShowingAppsMenu( false )
			}
		} )
		setIsShowingAppsMenu( true )
	}

	const hideAppsMenu = () => {
		dismissModal( modalID )
		setIsShowingAppsMenu( false )
	}

	const toggleIsShowingAppsMenu = () => {
		if ( ! isShowingAppsMenu ) {
			showAppsMenu()
		} else {
			hideAppsMenu()
		}
	}

	return {
		isShowingAppsMenu,
		showAppsMenu,
		hideAppsMenu,
		toggleIsShowingAppsMenu,
	}
}
