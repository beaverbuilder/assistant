import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import App from './app'
import AppIcon from './icon'

if ( ! __PRODUCTION__ ) {
	registerApp( 'fl-cloud', {
		label: __( 'Cloud' ),
		root: App,
		icon: AppIcon,
	} )
}
