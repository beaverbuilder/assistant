import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App } from './app'

registerApp( 'fl-form-testing', {
	label: __( 'Form Testing' ),
	root: App,
} )
