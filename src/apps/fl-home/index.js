import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import App from './app'

// Register the default card types
import './types'

registerApp( 'fl-home', {
	label: __( 'Home' ),
	root: App,
	shouldShowInAppList: false,
} )
