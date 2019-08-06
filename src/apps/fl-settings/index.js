import { registerApp, __ } from 'assistant'
import { App } from './app'

registerApp( 'fl-settings', {
	label: __( 'Preferences' ),
	root: App,
} )
