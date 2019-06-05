import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { currentUserCan } from 'utils/wordpress'
import { App, AppIcon } from './app'
import { initialState, actions, reducers, effects } from './state'

registerApp( 'fl-notifications', {
	label: __( 'Notifications' ),
	content: App,
	icon: AppIcon,
	enabled: (
		currentUserCan( 'update_plugins' ) ||
		currentUserCan( 'update_themes' ) ||
		currentUserCan( 'moderate_comments' )
	),
	state: initialState,
	actions,
	reducers,
	effects,
	shouldShowTitle: false,
} )
