import React, { Fragment, useState, useContext } from 'react'
import { useStore, useDispatch } from 'store'
import { Heading, Button, Icon, UIContext, StackContext, Separator } from 'components'
import './style.scss'

const AppsMenu = () => {
	const { apps } = useStore()
	const { setActiveApp } = useContext( UIContext )
	const { pushView } = useContext( StackContext )

	const excludedApps = [ 'fl-notifications' ]

	const clickItem = key => {
		setActiveApp( key )

		// @TODO: dismiss the menu
	}
	return (
		<Fragment>
			<Heading className="fl-asst-manage-apps-title">Manage Apps</Heading>
			<div className="fl-asst-app-list">
				{ Object.keys( apps ).map( key => {

					if ( excludedApps.includes( key ) ) {
						return null
					}

					const app = apps[key]

					const pushDetailView = app => {
						pushView( <AppDetailView {...app}/> )
					}

					if ( 'function' !== typeof app.icon ) {
						app.icon = props => <Icon name="default-app" {...props} />
					}

					if ( 'function' !== typeof app.settings ) {
						app.settings = () => null
					}

					return (
						<div className="fl-asst-app-list-item" key={key} onClick={ () => clickItem( key ) }>
							{ app.icon() }
							<div className="fl-asst-app-list-item-title">{app.label}</div>
							<div className="fl-asst-app-list-item-accessory">
								<Button appearance="icon" onClick={ e => pushDetailView( app, e )}>
									<Icon name="forward" />
								</Button>
							</div>
						</div>
					)
				} )}
			</div>
		</Fragment>
	)
}

const AppDetailView = ( { label, settings } ) => {
	const { popView } = useContext( StackContext )
	return (
		<div>
			<Heading>
				<Button onClick={popView} appearance="icon">
					<Icon name="back" />
				</Button>
				{label}
			</Heading>

			<Separator />
			{settings()}
		</div>
	)
}

export const useAppsMenu = () => {
	const { isShowingAppsMenu } = useStore()
	const { setIsShowingAppsMenu } = useDispatch()
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
