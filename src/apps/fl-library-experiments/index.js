import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
//import Icon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-library-experiments" */ './app'
) )

registerApp( 'fl-library-experiments', {
	label: __( 'Library Experiments' ),
	root: App,
} )
