import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from 'assistant/utils/url'
import { UpdatesApp } from './app'

registerApp( 'fl-updates', {
	label: __( 'Updates' ),
	root: UpdatesApp,
	icon: UpdatesApp.Icon,
	accent: {
		color: '#00D281'
	},
	state: {
		updatingAll: false,
	}
} )
