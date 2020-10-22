import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'

const App = lazy( () => import(
	/* webpackChunkName: "app-designsystem" */ './app'
) )

if ( ! __PRODUCTION__ ) {
	registerApp( 'designsystem', {
		label: __( 'Design System' ),
		root: App,
		icon: Icon.Pencil
	} )

}
