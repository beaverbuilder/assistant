import React, { useContext } from 'react'
import { Button } from 'ui'
import { Nav as FLUID_Nav } from 'fluid/ui'

const Nav = { ...FLUID_Nav }

Nav.Tabs = ( { tabs = [] } ) => {
	const { location, history } = useContext( Nav.Context )
	return (
		<>
			<Button.Group appearance="tabs" role="tablist">
				{ tabs.map( ( tab, i ) => {
					const { showButton = true, path, label, ...rest } = tab
					delete rest.component
					delete rest.exact
					return showButton && (
						<Button
							key={ i }
							isSelected={ location.pathname === path }
							onClick={ () => history.replace( path, {} ) }
							{ ...rest }
						>
							{ label }
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
