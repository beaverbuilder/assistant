import React from 'react'
import store, { useDispatch } from 'store'
import { currentUserCan } from 'utils/wordpress/user'

// Import tab views and their icons
import { DashboardTab, DashboardIcon } from './fl-dashboard'
import { FindTab, FindIcon } from './fl-find'
import { NotificationsTab, NotificationsIcon } from './fl-notifications'
import { MediaTab, MediaIcon } from './fl-media'

const config = {
	'fl-notifications': {
		label: 'Notifications',
		content: props => <NotificationsTab {...props} />,
		icon: props => <NotificationsIcon {...props} />,
		showTabIcon: false,
		enabled: (
			currentUserCan( 'update_plugins' ) ||
			currentUserCan( 'update_themes' ) ||
			currentUserCan( 'moderate_comments' )
		)
	},
	'fl-media': {
		label: 'Media',
		content: props => <MediaTab {...props} />,
		icon: props => <MediaIcon {...props} />,
	},
	'fl-find': {
		label: 'Find',
		content: props => <FindTab {...props} />,
		icon: props => <FindIcon {...props} />,
	},
	'fl-dashboard': {
		label: 'Dashboard',
		content: props => <DashboardTab {...props} />,
		icon: props => <DashboardIcon {...props} />,
	},
}

/**
 * The core assistant app is designed to work outside
 * of WordPress. However, apps registered inside of the
 * assistant may require a specific CMS be present to work.
 *
 * TODO: In the future we should look at better ways to
 * register apps based on where assistant is loaded.
 */
const { registerApp } = useDispatch()
const { cms } = store.getState()

if ( 'wordpress' === cms ) {
	Object.keys( config ).map( key => {
		registerApp( key, config[ key ] )
	} )
}
