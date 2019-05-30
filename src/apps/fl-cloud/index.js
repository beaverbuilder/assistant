import { __ } from '@wordpress/i18n'
import { getSystemActions } from 'store'
import { App, AppIcon } from './app'

const { registerApp } = getSystemActions()

registerApp( 'fl-debug', {
	label: __( 'Cloud' ),
	root: App,
	icon: AppIcon,
	accentColor: {
		color: '#FA9200'
	}
} )
