import React, { createContext, useContext, useEffect } from 'react'
import classname from 'fl-classnames'
import { withRouter, MemoryRouter, Link, Switch, Route } from 'fl-react-router-dom'
import { useSystemState, getSystemActions } from 'store'
import { Button, Icon } from 'lib'

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
		<MemoryRouter { ...routerProps }>
			<NavManager onChange={ handleChange }>{children}</NavManager>
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
	isAppRoot: false,
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
		path: location.pathname,
		isRoot: 0 === history.index,
		goToRoot: () => history.go( -history.index ),
		isAppRoot: 1 === history.index,
		goToAppRoot: () => history.go( -( history.index + 1 ) ),
	}

	return (
		<Nav.Context.Provider value={ context }>{children}</Nav.Context.Provider>
	)
} )

Nav.Link = Link

Nav.Switch = Switch

Nav.Route = Route

Nav.ButtonLink = ( { className, appearance, ...rest } ) => {
	const classes = classname( {
		'fl-asst-button': true,
		[`fl-asst-button-appearance-${appearance}`]: appearance
	}, className )
	return (
		<Nav.Link className={ classes } { ...rest } />
	)
}

/**
* Link - Need to revisit these - probably remove
*/
Nav.SubLink = ( { to, ...rest } ) => {
	const { path } = useContext( Nav.Context )
	return (
		<Link to={ path + to } { ...rest } />
	)
}
Nav.AppLink = ( { to, ...rest } ) => {

	//const { path } = useContext( Nav.Context )
	return <Link to={ to } { ...rest } />
}
Nav.AppLink.displayName = 'Nav.AppLink'

Nav.useTabs = () => {
	return {}
}

Nav.Tabs = ( { tabs = [] } ) => {
	const { path, history } = useContext( Nav.Context )
	return (
		<>
			<Button.Group appearance="tabs" className="fl-asst-tabs">
				{ tabs.map( ( tab, i ) => {
					return (
						<Button
							key={ i }
							isSelected={ path === tab.path }
							onClick={ () => history.replace( tab.path, {} ) }
						>
							{ tab.label }
						</Button>
					)
				} ) }
				<Button className="fl-asst-more-btn">
					<Icon.More />
				</Button>
			</Button.Group>
		</>
	)
}
Nav.Tabs.displayName = 'Nav.Tabs'

Nav.CurrentTab = ( { tabs = [] } ) => {
	return (
		<Nav.Switch>
			{ tabs.map( ( tab, i ) => {
				const { exact = false, path, component } = tab
				return (
					<Nav.Route key={ i } exact={ exact } path={ path } component={ component }  />
				)
			} )}
		</Nav.Switch>
	)
}
Nav.CurrentTab.displayName = 'Nav.CurrentTab'
