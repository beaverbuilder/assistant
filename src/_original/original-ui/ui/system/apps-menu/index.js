import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { useSystemState, getSystemActions } from 'store'
import { Title, Icon, UIContext, Button } from 'components'
import { render } from 'shared-utils/react'
import './style.scss'

const AppsMenu = () => {
	const { apps, appOrder } = useSystemState()
	const { activeAppName, setActiveApp } = useContext( UIContext )
	const excludedApps = [ 'fl-notifications' ]

	const clickItem = key => {
		setActiveApp( key )
	}

	return (
		<Fragment>
			<Title>{__( 'Apps' )}</Title>
			<div className="fl-asst-app-list">
				{ appOrder.map( ( key ) => {

					if ( excludedApps.includes( key ) ) {
						return null
					}

					const app = apps[key]

					if ( 'undefined' === typeof app || false === app.enabled ) {
						return null
					}

					const isSelected = key === activeAppName

					let icon = render( app.icon )
					if ( ! icon ) {
						icon = <Icon name="default-app" />
					}

					return (
						<Button
							className="fl-asst-app-list-item"
							key={key}
							appearance="transparent"
							onClick={ () => clickItem( key ) }
							isSelected={isSelected}
						>
							{ icon }
							<div className="fl-asst-app-list-item-title">
								{app.label}
							</div>
						</Button>
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
