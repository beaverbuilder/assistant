import React, { Fragment, useState, useContext } from 'react'
import { useStore, useDispatch } from 'store'
import { Heading, Icon, Button, Padding, UIContext } from 'components'
import './style.scss'

export const AppsMenu = () => {
	const { apps } = useStore()
	const { setActiveApp } = useDispatch()

	const clickItem = key => {
		setActiveApp( key )
		// dismiss the menu???
	}
	return (
		<Fragment>
			<Heading className="fl-asst-manage-apps-title">Manage Apps</Heading>
			<div className="fl-asst-app-list">
				{ Object.keys( apps ).map( key => {

					if ( 'fl-notifications' === key ) {
						return null
					}

					const app = apps[key]
					return (
						<div className="fl-asst-app-list-item" key={key} onClick={ () => clickItem( key ) }>
							{ app.icon() }
							<div className="fl-asst-app-list-item-title">{app.label}</div>
						</div>
					)
				} )}
			</div>
		</Fragment>
	)
}

export const useAppsMenu = () => {
	const [ isShowing, setIsShowing ] = useState( false )
	const { presentModal, dismissModal } = useContext( UIContext )
	const modalID = 'fl-apps'

	const showAppsMenu = () => {
		presentModal( <AppsMenu />, {
			id: modalID,
			appearance: 'menu',
			onDismiss: () => {
				setIsShowing( false )
			}
		} )
		setIsShowing( true )
	}

	const hideAppsMenu = () => {
		dismissModal( modalID )
		setIsShowing( false )
	}

	const toggleIsShowingAppsMenu = () => isShowing ? hideAppsMenu() : showAppsMenu()

	return {
		isShowingAppsMenu: isShowing,
		showAppsMenu,
		hideAppsMenu,
		toggleIsShowingAppsMenu,
	}
}
