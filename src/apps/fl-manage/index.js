import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import App from './app'

registerApp( 'fl-manage', {
	label: __( 'Apps & Settings' ),
	root: App,
	shouldShowInAppList: false,
} )
