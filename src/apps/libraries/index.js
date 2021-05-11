import { lazy } from 'react'
import { setupLibrariesApp } from '@beaverbuilder/cloud-ui'
import { Icon } from 'assistant/ui'

const App = lazy( () => import(
	/* webpackChunkName: "app-libraries" */ './app'
) )

setupLibrariesApp( {
	root: App,
	icon: Icon.Library,
} )
