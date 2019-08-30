import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App, AppIcon } from './app'

registerApp( 'fl-search', {
	label: __( 'Search' ),
	root: App,
	icon: AppIcon,
	state: {
		keyword: ''
	},
	shouldShowInAppList: false,
} )
