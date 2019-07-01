import { registerApp, __ } from 'assistant'
import { App } from './app'

registerApp( 'fl-ui-examples', {
	label: __( 'Examples' ),
	root: App,
	icon: App.Icon,
} )
