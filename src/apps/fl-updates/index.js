import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { UpdatesApp } from './app'

export const defaultState = {
	updatingAll: false,
	updateType: 'all',
	listStyle: 'card',
}

registerApp( 'fl-updates', {
	label: __( 'Updates' ),
	root: UpdatesApp,
	icon: UpdatesApp.Icon,
	accent: {
		color: '#00D281'
	},
	state: {
		...defaultState,
	}
} )
