import React, { createContext, useEffect } from 'fl-react'
import { withRouter } from 'fl-react-router-dom'

export const Nav = () => {}

Nav.defaults = {}

Nav.Context = createContext( Nav.defaults )

const Manager = ( { children, location, match, history, onChange = () => {} } ) => {

	useEffect( () => {
		if ( 'function' === typeof onChange ) {
			onChange( history, location, match )
		}
	}, [ location ] )

	const context = {
		location,
		match,
		history,
	}

	return (
		<Nav.Context.Provider value={context}>{children}</Nav.Context.Provider>
	)
}

Nav.Manager = withRouter( Manager )
