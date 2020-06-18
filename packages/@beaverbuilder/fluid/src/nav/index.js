import React, { createContext, useEffect, useContext } from 'react'
import {
	withRouter,
	MemoryRouter,
	Switch,
	Route,
	Link,
	useHistory,
} from 'react-router-dom'

import Button from '../button'
import { Icon } from '../art'

const Nav = () => {}

Nav.Switch = Switch
Nav.Switch.displayName = 'Nav.Switch'

Nav.Route = Route
Nav.Route.displayName = 'Nav.Route'

Nav.Link = Link
Nav.Link.displayName = 'Nav.Link'

Nav.BackButton = props => {
	const history = useHistory()
	return (
		<Button
			className="fluid-back-button"
			appearance="transparent"
			onClick={ history.goBack }
			{ ...props }
		>
			<Icon.BackArrow />
		</Button>
	)
}

export default Nav
