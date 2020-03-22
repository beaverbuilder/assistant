import React, { createContext, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { useSystemState } from 'data'

export const App = ( { children, ...rest } ) => {
	return (
		<div className="fl-asst-app-root" { ...rest }>
			{children}
		</div>
	)
}

App.defaults = {
	handle: null,
	label: null,
	icon: () => {},
	accentColor: { color: null, },
	environment: 'normal'
}

/**
 * Context
 */
App.Context = createContext( App.defaults )
App.Context.displayName = 'App.Context'

/**
 * Provider
 */
App.Provider = withRouter( ( { children, location, environment = 'normal' } ) => {
	const { apps } = useSystemState()

	const parts = location.pathname.split( '/' )
	const name = parts[1]
	const app = '' !== name ? apps[name] : {}
	const isAppRoot = 2 >= parts.length
	const context = {
		...App.defaults,
		handle: name,
		environment,
		isAppRoot,
		...app
	}
	return (
		<App.Context.Provider value={ context }>
			{children}
		</App.Context.Provider>
	)
} )
App.Provider.displayName = 'App.Provider'

App.useApp = () => {
	const context = useContext( App.Context )
	return context
}
