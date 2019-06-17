import React, { createContext, useEffect } from 'fl-react'
import { withRouter } from 'fl-react-router-dom'

export const Nav = () => {}

Nav.defaults = {
	location: null,
	match: null,
	history: null,
}

Nav.Context = createContext( Nav.defaults )

const NavManager = ( { children, location, match, history, onChange = () => {} } ) => {

	useEffect( () => {
		if ( 'function' === typeof onChange ) {
			onChange( history, location, match )
		}
	}, [ location ] )

	const context = {
		...Nav.defaults,
		location,
		match,
		history,
	}

	return (
		<Nav.Context.Provider value={context}>{children}</Nav.Context.Provider>
	)
}

Nav.Manager = withRouter( NavManager )
