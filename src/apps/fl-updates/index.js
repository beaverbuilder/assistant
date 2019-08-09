import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils/url'
import { UpdatesApp } from './app'

registerApp( 'fl-updates', {
	label: __( 'Updates' ),
	root: UpdatesApp,
	icon: UpdatesApp.Icon,
	accent: {
		color: '#00D281'
	},
} )
