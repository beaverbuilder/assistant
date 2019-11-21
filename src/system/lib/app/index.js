import React, { createContext } from 'react'
import { withRouter } from 'react-router-dom'
import { useSystemState } from 'store'

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
	accentColor: { color: null, }
}

/**
 * Context
 */
App.Context = createContext( App.defaults )
App.Context.displayName = 'App.Context'

/**
 * Provider
 */
App.Provider = withRouter( ( { children, location } ) => {
	const { apps } = useSystemState()

	const parts = location.pathname.split( '/' )
	const name = parts[1]
	const app = '' !== name ? apps[name] : {}
	const context = {
		...App.defaults,
		handle: name,
		...app
	}
	return (
		<App.Context.Provider value={ context }>{children}</App.Context.Provider>
	)
} )
App.Provider.displayName = 'App.Provider'
