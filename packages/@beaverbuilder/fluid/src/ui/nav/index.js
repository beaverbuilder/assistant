import { createContext, useEffect, useContext } from 'react'
import {
    withRouter,
    MemoryRouter,
    Switch,
    Route,
    Link
} from 'react-router-dom'
import { Button, Icon } from '../'

const Nav = () => {}

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

const Provider = withRouter( ( { children, location, match, history, onChange } ) => {

    // Whenever location changes, fire onChange handler.
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
        isRoot: 0 === history.index,
        goToRoot: () => history.go( -history.index )
    }

    return (
        <Nav.Context.Provider value={context}>
            {children}
        </Nav.Context.Provider>
    )
})

Nav.Root = ({
    children,
    router: Router = MemoryRouter,
    onHistoryChanged = () => {},
    ...rest
}) => {
    return (
        <Router {...rest}>
            <Provider onChange={onHistoryChanged}>
                {children}
            </Provider>
        </Router>
    )
}
Nav.Root.displayName = 'Nav.Root'

Nav.Switch = Switch
Nav.Switch.displayName = 'Nav.Switch'

Nav.Route = Route
Nav.Route.displayName = 'Nav.Route'

Nav.Link = Link
Nav.Link.displayName = 'Nav.Link'

Nav.withRouter = withRouter

Nav.BackButton = () => {
    const { history } = useContext( Nav.Context )
    return (
        <Button onClick={history.goBack}>
            <Icon.BackArrow />
        </Button>
    )
}

export default Nav
