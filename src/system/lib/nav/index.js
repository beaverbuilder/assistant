import React, { createContext, useContext, useEffect } from 'fl-react'
import { withRouter, MemoryRouter, Link, Switch, Route } from 'fl-react-router-dom'
import { useSystemState, getSystemActions } from 'store'
import { App } from '../'

export const Nav = () => {}

Nav.Provider = ( { children } ) => {
	const { history } = useSystemState()
	const { setHistory } = getSystemActions()

	const routerProps = {
		initialIndex: history.index,
		/* do NOT include a default for initialEntries */
	}
	if ( history.entries && history.entries.length ) {
		routerProps.initialEntries = history.entries
	}

	const handleChange = ( history ) => {
		setHistory( history.index, history.entries )
	}

	return (
		<MemoryRouter {...routerProps}>
			<NavManager onChange={handleChange}>{children}</NavManager>
		</MemoryRouter>
	)
}
Nav.Provider.displayName = 'Nav.Provider'

Nav.defaults = {
	location: null,
	match: null,
	history: null,
	path: null,
	isRoot: false,
	goToRoot: () => {}
}

Nav.Context = createContext( Nav.defaults )
Nav.Context.displayName = 'Nav.Context'

const NavManager = withRouter( ( { children, location, match, history, onChange = () => {} } ) => {

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
		path: match.url,
		isRoot: 0 === history.index,
		goToRoot: () => history.go( -history.index )
	}

	return (
		<Nav.Context.Provider value={context}>{children}</Nav.Context.Provider>
	)
} )

Nav.SubLink = ( { to, ...rest } ) => {
	const { path } = useContext( Nav.Context )
	return (
		<Link to={ path + to } {...rest} />
	)
}

Nav.Link = Link

Nav.Switch = Switch

Nav.Route = Route

/**
* Link
*/
Nav.AppLink = ( { to, ...rest } ) => {
	const { handle } = useContext( App.Context )
	return <Link to={`/${handle}${to}`} {...rest} />
}
Nav.AppLink.displayName = 'Nav.AppLink'
