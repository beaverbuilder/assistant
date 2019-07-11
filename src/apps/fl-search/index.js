import { registerApp, __ } from 'assistant'
import { App, AppIcon } from './app'

registerApp( 'fl-search', {
	label: __( 'Search' ),
	root: App,
	icon: AppIcon,
	state: {
		keyword: '',
	},
} )
