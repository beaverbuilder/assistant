import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App, Icon } from './app'
import storeConfig from './state'

registerApp( 'fl-dashboard', {
	label: __( 'Dashboard' ),
	content: App,
	icon: Icon,
	shouldShowTitle: false,
	...storeConfig,
} )
