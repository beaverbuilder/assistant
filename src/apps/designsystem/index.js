import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { Icon } from '@beaverbuilder/fluid'
import App from './app'

if ( ! __PRODUCTION__ ) {
	registerApp( 'designsystem', {
		label: __( 'Design System' ),
		root: App,
		icon: Icon.Pencil
	} )

}
