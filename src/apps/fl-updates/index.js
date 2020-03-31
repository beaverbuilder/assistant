import { registerApp } from 'assistant'
import { currentUserCan } from 'assistant/utils/wordpress'
import { __ } from '@wordpress/i18n'
import { UpdatesApp } from './app'
import Icon from './icon'

export const defaultState = {
	updatingAll: false,
	updateType: 'all',
	listStyle: 'card',
}

registerApp( 'fl-updates', {
	label: __( 'Updates' ),
	root: UpdatesApp,
	icon: Icon,
	enabled: currentUserCan( 'update_plugins' ) && currentUserCan( 'update_themes' ),
	accent: {
		color: '#00D281'
	},
	state: {
		...defaultState,
	}
} )
