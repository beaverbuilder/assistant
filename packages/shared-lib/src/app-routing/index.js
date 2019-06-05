import React, { createContext, useContext } from 'fl-react'
import { MemoryRouter, Switch, Route, Link } from 'react-router-dom'

export { Switch, Route, Link }

export const defaultAppContext = {
    handle: null,
    label: null,
    icon: () => {},
    accentColor: { color: null, }
}

export const AppContext = createContext( defaultAppContext )
AppContext.displayName = 'AppContext'

export const AppRoute = ({ path, ...rest }) => {
    const { handle } = useContext( AppContext )
    return <Route path={`/${handle}${path}`} {...rest} />
}

export const AppLink = ({ to, ...rest }) => {
    const { handle } = useContext( AppContext )
    return <Link to={`/${handle}${to}`} {...rest} />
}

export const StoreRouter = MemoryRouter
