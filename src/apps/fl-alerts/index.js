import { registerApp, __ } from 'assistant'
import { Alerts } from './app'

registerApp( 'fl-alerts', {
	label: __( 'Alerts' ),
	root: Alerts,
} )
