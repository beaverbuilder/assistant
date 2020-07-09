import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { Icon } from 'fluid'
import App from './app'

if ( ! __PRODUCTION__ ) {
	registerApp( 'designsystem', {
		label: 'Design System',
		root: App,
		icon: Icon.Pencil
	} )

}
