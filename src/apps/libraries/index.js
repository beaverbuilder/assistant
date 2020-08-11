import { lazy } from 'react'
import { Libraries } from '@beaverbuilder/cloud-ui'
import AppIcon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-cloud-libraries" */ './app'
) )

if ( ! __PRODUCTION__ ) {
	Libraries.setupApp( {
		root: App,
		icon: AppIcon,
	} )
}
