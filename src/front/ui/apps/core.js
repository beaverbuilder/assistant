import React from 'react'
import { Icon } from 'components'
import { DashboardTab } from './fl-dashboard'
import { NavigateTab } from './fl-navigate'
import { NotificationsTab } from './fl-notifications'
import { registerApp } from 'apps'

registerApp( 'fl-dashboard', {
	label: 'Dashboard',
	content: <DashboardTab />,
	icon: <Icon />,
} )

registerApp( 'fl-navigate', {
	label: 'Navigate',
	content: <NavigateTab />,
	icon: <Icon name="find-app" />,
} )

registerApp( 'fl-notifications', {
	label: 'Notifications',
	content: <NotificationsTab />,
	icon: <Icon name="notifications-active" />,
	showTabIcon: false,
} )
