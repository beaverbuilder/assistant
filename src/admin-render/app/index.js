import React, { useEffect, Suspense, memo } from 'react'
import classname from 'classnames'
import { Switch, Route, Redirect } from 'react-router-dom'
import { App, Error, Page } from 'assistant/ui'
import { useSystemState, getSystemSelectors } from 'assistant/data'
import ErrorPage from './error-page'
import './style.scss'

const AppMain = () => {
    const { selectHomeKey } = getSystemSelectors()
    const home = selectHomeKey()
    return (
        <Error.Boundary alternate={ ErrorPage }>
            <div className="fl-asst-main-content" >
                <Switch>
                    <Route exact path="/">
                        <Redirect to={ `/${home}` } />
                    </Route>
                    <Route path="/:app" component={ AppContent } />
                    <Route component={ Page.NotFound } />
                </Switch>
            </div>
        </Error.Boundary>
    )
}

const AppContent = () => {
	useSystemState( 'apps' )
	const { selectApp } = getSystemSelectors()
	const { isAppRoot, app: appName = '' } = App.useApp()
	const app = selectApp( appName )

	if ( ! app ) {
		return <Page.NotFound />
	}

	// Subsequent app changes
	useEffect( () => app.onMount(), [ appName ] )

	const appWrapClasses = classname( {
		'fl-asst-screen-content': true,
		'fl-asst-app-content': true,
		[`fl-asst-app-${appName}`]: appName,
		'fl-asst-app-root': isAppRoot,
	} )

	const props = {
		handle: app.handle,
		baseURL: `/${app.handle}`,
		label: app.label,
	}

	return (
		<div className={ appWrapClasses }>
			<Suspense fallback={ <Page.Loading /> }>
				<AppRoot root={ app.adminRoot } { ...props } />
			</Suspense>
		</div>
	)
}

const AppRoot = memo( ( { root: Root, ...rest } ) => {
	return Root ? <Root { ...rest } /> : <Page.NotFound />
} )

export default AppMain
