import { registerApp, __ } from 'assistant'
import { CloudApp } from './app'

registerApp( 'fl-cloud', {
	label: __( 'Cloud' ),
	root: CloudApp,
	icon: CloudApp.Icon,
	accent: {
		color: '#FA9200'
	}
} )
