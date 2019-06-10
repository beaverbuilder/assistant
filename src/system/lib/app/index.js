import React, { createContext, useState, useContext, useEffect } from 'fl-react'
import { Link } from 'fl-react-router-dom'

export const App = props => props.children

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
* Link
*/
App.Link = ( { to, ...rest } ) => {
	const { handle } = useContext( App.Context )
	return <Link to={`/${handle}${to}`} {...rest} />
}
App.Link.displayName = 'App.Link'
