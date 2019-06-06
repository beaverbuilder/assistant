import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App, AppIcon } from './app'

registerApp( 'fl-cloud', {
	label: __( 'Cloud' ),
	root: App,
	icon: AppIcon,
	accent: {
		color: '#FA9200'
	}
} )
