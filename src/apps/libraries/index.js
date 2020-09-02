import { lazy } from 'react'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Icon } from 'assistant/ui'

const App = lazy( () => import(
	/* webpackChunkName: "app-libraries" */ './app'
) )

Libraries.setupApp( {
	root: App,
	icon: Icon.Library,
} )
