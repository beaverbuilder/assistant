import { lazy } from 'react'
import { registerApp } from 'assistant'
import { currentUserCan } from 'assistant/utils/wordpress'
import { __ } from '@wordpress/i18n'
import Icon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-updates" */ './app'
) )

export const defaultState = {
	updatingAll: false,
	updateType: 'all',
	listStyle: 'card',
}

registerApp( 'fl-updates', {
	label: __( 'Updates' ),
	root: App,
	icon: Icon,
	enabled: currentUserCan( 'update_plugins' ) && currentUserCan( 'update_themes' ),
	accent: {
		color: '#00D281'
	},
	state: {
		...defaultState,
	}
} )
