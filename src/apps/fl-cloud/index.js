import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { Main, AppIcon } from './app'

registerApp( 'fl-cloud', {
	label: __( 'Cloud' ),
	root: Main,
	icon: AppIcon,
	accent: {
		color: '#FA9200'
	}
} )
