import React, { createContext } from 'fl-react'

export const App = ( { children, ...rest } ) => {
	return (
		<div className="fl-asst-app-root" {...rest}>
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
