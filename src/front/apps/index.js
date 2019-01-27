import React from 'react'
import { useDispatch } from 'store'

// Import tab views and their icons
import { DashboardTab, DashboardIcon } from './fl-dashboard'
import { FindTab, FindIcon } from './fl-find'
import { NotificationsTab, NotificationsIcon } from './fl-notifications'
import { MediaTab, MediaIcon } from './fl-media'
import { KitchenSinkTab, KitchenSinkIcon } from './fl-kitchen-sink'

const { registerApp } = useDispatch()

registerApp( 'fl-notifications', {
	label: 'Notifications',
	content: props => <NotificationsTab {...props} />,
	icon: props => <NotificationsIcon {...props} />,
	showTabIcon: false,
} )
/*
registerApp( 'fl-kitchen-sink', {
	label: 'UI Kitchen Sink',
	content: props => <KitchenSinkTab {...props} />,
	icon: props => <KitchenSinkIcon {...props} />,
} )
*/
registerApp( 'fl-media', {
	label: 'Media',
	content: props => <MediaTab {...props} />,
	icon: props => <MediaIcon {...props} />,
} )

registerApp( 'fl-find', {
	label: 'Find',
	content: props => <FindTab {...props} />,
	icon: props => <FindIcon {...props} />,
} )

registerApp( 'fl-dashboard', {
	label: 'Dashboard',
	content: props => <DashboardTab {...props} />,
	icon: props => <DashboardIcon {...props} />,
} )
