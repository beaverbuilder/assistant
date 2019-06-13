import React, { createContext, useContext } from 'fl-react'
import { MemoryRouter, Link } from 'fl-react-router-dom'

export const App = props => props.children

App.defaults = {
	handle: null,
	label: null,
	icon: () => {},
	accentColor: { color: null, }
}

App.Context = createContext( App.defaults )
App.Context.displayName = 'App.Context'

App.Link = ( { to, ...rest } ) => {
	const { handle } = useContext( App.Context )
	return <Link to={`/${handle}${to}`} {...rest} />
}

App.Router = MemoryRouter
