import React, { Fragment, Suspense, useEffect } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import Error from '../error'

const AppCoreDefaultSuspenseFallback = () => (
    <div>Loading...</div>
)

const AppCoreRoot = ({
    children,

    // Error API  - setup default boundary alternate view
    error,

    // Suspense API - setup default fallback view for suspense loading
    loading: Loading = AppCoreDefaultSuspenseFallback,

    // Navigation API - for setting up the default router
    router = MemoryRouter, // Set to false if not using react-router
    routerProps = {}
}) => {

    const Router = ( false !== router ) ? router : Fragment

    return (
        <Error.Boundary alternate={ error }>
            <Router {...routerProps}>
                <Suspense fallback={ <Loading /> }>
                    {children}
                </Suspense>
            </Router>
        </Error.Boundary>
    )
}

export default AppCoreRoot
