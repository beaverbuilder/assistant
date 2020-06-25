import React, { memo, Suspense, useEffect } from 'react'
import { Switch, Route, Redirect, useParams, useLocation } from 'react-router-dom'
import { __, sprintf } from '@wordpress/i18n'
import { AppContext, defaultAppContext, useAppContext } from './context'
import Error from '../error'

const Content = ({
    apps = {},
    defaultApp = 'home', // handle for default app
    notFound: NotFound = DefaultPageNotFound,
    loading: AppLoading = DefaultAppLoadingScreen
}) => {

    const CoreError = props => (
        <Error.Page
            title={__( "App Core: There seems to be an issue rendering current app." )}
            {...props}
        />
    )

    return (
        <Error.Boundary alternate={ CoreError }>
            <Switch>
                <Route exact path="/">
                    <Redirect to={ `/${defaultApp}` } />
                </Route>
                <Route
                    path="/:app"
                    render={ () => (
                        <CurrentApp
                            loading={ AppLoading }
                            apps={ apps }
                        />
                    )}
                />
                <Route component={ NotFound } />
            </Switch>
        </Error.Boundary>
    )
}

const CurrentApp = ({
    loading: LoadingScreen,
    error: ErrorScreen = DefaultErrorScreen,
    apps,
}) => {
    const location = useLocation()
    const { app: handle } = useParams()
    const { label, root, onMount = () => {} } = apps[ handle ]
	const isAppRoot = 2 >= location.pathname.split( '/' ).length

    const context = {
        ...defaultAppContext,
        handle,
        baseURL: `/${handle}`,
        label,
        isAppRoot,
    }

    // Subsequent app changes
	useEffect( () => {
        if ( onMount && 'function' === typeof onMount ) {
            return onMount()
        }
    }, [ handle ] )

    return (
        <AppContext.Provider value={ context }>
            <Error.Boundary alternate={ DefaultErrorScreen }>
                <Suspense fallback={ <LoadingScreen /> }>
                    <AppRoot root={ root } {...context} />
                </Suspense>
            </Error.Boundary>
        </AppContext.Provider>
    )
}


const AppRoot = memo( ( { root: Root, ...rest } ) => {
	return Root ? <Root { ...rest } /> : <DefaultPageNotFound />
} )

const DefaultAppLoadingScreen = () => <CenteredBox>{__('Loading...')}</CenteredBox>

const DefaultPageNotFound = () => (
    <CenteredBox>
        <h1>{__('App Not Found')}</h1>
    </CenteredBox>
)

const DefaultErrorScreen = props => {
    const { label } = useAppContext()
    return (
        <Error.Page
            title={ sprintf('There seems to be an issue with the %s app.', label ) }
            {...props}
        />
    )
}

const CenteredBox = ({ children }) => (
    <div
        style={{
            flex: '1 1 auto',
            minHeight: 0,
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >{children}</div>
)

export default Content
