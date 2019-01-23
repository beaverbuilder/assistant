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
	icon: props => <Icon name="notifications-active" {...props} />,
	showTabIcon: false,
} )

registerApp( 'fl-media', {
	label: 'Media',
	content: props => <MediaTab {...props} />,
	icon: props => <Icon name="media-app" {...props} />,
} )

registerApp( 'fl-find', {
	label: 'Find',
	content: props => <FindTab {...props} />,
	icon: props => <Icon name="find-app" {...props} />,
} )

registerApp( 'fl-dashboard', {
	label: 'Dashboard',
	content: props => <DashboardTab {...props} />,
	icon: props => <Icon {...props} />,
} )
