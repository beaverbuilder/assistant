import React from 'react'
import { Icon } from 'components'
import { DashboardTab } from './fl-dashboard'
import { FindTab } from './fl-find'
import { NotificationsTab } from './fl-notifications'
import { MediaTab } from './fl-media'
import { useDispatch } from 'store'

const { registerApp } = useDispatch()

registerApp( 'fl-notifications', {
	label: 'Notifications',
	content: props => <NotificationsTab {...props} />,
	icon: <Icon name="notifications-active" />,
	showTabIcon: false,
} )

registerApp( 'fl-media', {
	label: 'Media',
	content: props => <MediaTab {...props} />,
	icon: <Icon />,
} )

registerApp( 'fl-find', {
	label: 'Find',
	content: props => <FindTab {...props} />,
	icon: <Icon name="find-app" />,
} )

registerApp( 'fl-dashboard', {
	label: 'Dashboard',
	content: props => <DashboardTab {...props} />,
	icon: <Icon />,
} )
