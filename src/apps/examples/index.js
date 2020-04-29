import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import Icon from './icon'

if ( ! __PRODUCTION__ ) {

	const App = lazy( () => import(
		/* webpackChunkName: "app-examples" */ './app'
	) )

	registerApp( 'fl-ui-examples', {
		label: __( 'UI Examples' ),
		root: App,
		icon: Icon,
	} )
}
