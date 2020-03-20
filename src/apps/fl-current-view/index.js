import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import App from './app'

//import Icon from './icon'

if ( ! __PRODUCTION__ ) {
	registerApp( 'fl-current-view', {
		label: __( 'Currently Viewing' ),
		root: App,
	} )
}
