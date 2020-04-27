import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import Icon from './icon'

const App = lazy( () => import(
    /* webpackChunkName: "app-labels" */ "./app"
) )

registerApp( 'fl-labels', {
	label: __( 'Labels' ),
	root: App,
	icon: Icon,
} )
