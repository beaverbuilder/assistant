import React, { useContext } from 'react'
import { Button, Icon } from 'ui'
import { Nav as FLUID_Nav } from 'fluid/ui'

const Nav = { ...FLUID_Nav }

Nav.Tabs = ( { tabs = [] } ) => {
	const nav = useContext( Nav.Context )
	const { location, history } = useContext( Nav.Context )
	return (
		<>
			<Button.Group appearance="tabs">
				{ tabs.map( ( tab, i ) => {
					return (
						<Button
							key={ i }
							isSelected={ location.pathname === tab.path }
							onClick={ () => history.replace( tab.path, {} ) }
						>
							{ tab.label }
						</Button>
					)
				} ) }
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

export { Nav }

export default Nav
