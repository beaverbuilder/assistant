import React, { useContext } from 'react'
import { Button, Icon } from 'ui'
import { Nav as FLUID_Nav } from 'fluid/ui'

const Nav = { ...FLUID_Nav }

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

export { Nav }

export default Nav
