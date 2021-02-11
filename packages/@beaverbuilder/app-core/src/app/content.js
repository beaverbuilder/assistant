import React, { memo, Suspense, useEffect } from 'react'
import { Switch, Route, Redirect, useParams, useLocation, useHistory } from 'react-router-dom'
import { AppContext, defaultAppContext, useAppContext } from './context'
import Error from '../error'

const CoreError = props => (
	<Error.Page
		title={ 'App Core: There seems to be an issue rendering current app.' }
		{ ...props }
	/>
)

const DefaultAppLoadingScreen = () => {
	return (
		<h1 style={ { margin: 'auto' } }>Loading...</h1>
	)
}

const Content = ( {
	apps = {},
	defaultApp = 'home', // handle for default app
	loading: AppLoading = DefaultAppLoadingScreen
} ) => {

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
					) }
				/>
			</Switch>
		</Error.Boundary>
	)
}

const CurrentApp = ( {
	loading: LoadingScreen,
	error: ErrorScreen = DefaultErrorScreen,
	apps,
} ) => {
	const history = useHistory()
	const location = useLocation()
	const { app: handle } = useParams()

	// Subsequent app changes
	useEffect( () => {
		if ( apps[handle] && 'function' === typeof apps[handle].onMount ) {
			return apps[handle].onMount()
		}
	}, [ handle ] )

	if ( ! apps[handle] ) {
		history.go( -history.length )
		history.replace( '/', {} )
		return null
	}

	const { label = '', root } = apps[ handle ]
	const isAppRoot = 2 >= location.pathname.split( '/' ).length

	const context = {
		...defaultAppContext,
		handle,
		baseURL: `/${handle}`,
		label,
		isAppRoot,
	}

	return (
		<AppContext.Provider value={ context }>
			<Error.Boundary alternate={ ErrorScreen }>
				<Suspense fallback={ <LoadingScreen /> }>
					<AppRoot root={ root } { ...context } />
				</Suspense>
			</Error.Boundary>
		</AppContext.Provider>
	)
}

const DefaultPageNotFound = () => (
	<CenteredBox>
		<h1>{ 'App Not Found' }</h1>
	</CenteredBox>
)

const AppRoot = memo( ( { root: Root, ...rest } ) => {
	return Root ? <Root { ...rest } /> : <DefaultPageNotFound />
} )

const DefaultErrorScreen = props => {
	const { label } = useAppContext()
	return (
		<Error.Page
			title={ `There seems to be an issue with the ${ label } app.` }
			{ ...props }
		/>
	)
}

const CenteredBox = ( { children } ) => (
	<div
		style={ {
			flex: '1 1 auto',
			minHeight: 0,
			maxHeight: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center'
		} }
	>{children}</div>
)

export default Content
