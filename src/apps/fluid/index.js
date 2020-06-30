import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import App from './app'

if ( ! __PRODUCTION__ ) {
    registerApp( 'fluid', {
    	label: __( 'FLUID Design System' ),
    	root: App
    } )
}
