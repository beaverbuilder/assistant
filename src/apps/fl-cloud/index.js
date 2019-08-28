import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { CloudApp } from './app'

registerApp( 'fl-cloud', {
	label: __( 'Cloud' ),
	root: CloudApp,
	icon: CloudApp.Icon,
	accent: {
		color: '#FA9200'
	}
} )
