import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App } from './app'

if ( !__PRODUCTION__ ) {
	registerApp( 'fl-ui-examples', {
		label: __( 'UI Examples' ),
		root: App,
		icon: App.Icon,
		accent: { color: '#8bc34a' },
	} )
}
