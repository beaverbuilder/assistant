import { lazy } from 'react'
import { setupLibrariesApp } from '@beaverbuilder/cloud-ui'
import { Icon } from 'assistant/ui'

const App = lazy( () => import(
	/* webpackChunkName: "app-libraries" */ './app'
) )

if ( ! __PRODUCTION__ || __INCLUDE_PRO__ ) {
	setupLibrariesApp( {
		root: App,
		icon: Icon.Library,
	} )
}
