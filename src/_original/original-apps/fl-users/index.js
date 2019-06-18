import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { wordpress } from 'assistant/utils'
import { App, AppIcon } from './app'
import { initialState, actions, reducers, effects } from './state'
const { currentUserCan } = wordpress

registerApp( 'fl-users', {
	label: __( 'People' ),
	content: App,
	icon: AppIcon,
	enabled: currentUserCan( 'edit_users' ),
	state: initialState,
	actions,
	reducers,
	effects,

	accentColor: {
		color: '#5C5AFF'
	}
} )
