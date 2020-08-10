import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import ContentIcon from '../fl-content/icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-detail-experiment" */ './app'
) )

if ( ! __PRODUCTION__ ) {
	registerApp( 'detail-experiment', {
		label: __( 'Detail Experiment' ),
		root: App,
		icon: ContentIcon
	} )

}
