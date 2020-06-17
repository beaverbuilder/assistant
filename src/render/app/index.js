import React, { memo, Suspense, useEffect } from 'react'
import classname from 'classnames'
import { useLocation, useParams, Redirect, Route, Switch } from 'react-router-dom'
import { App, Error } from '@beaverbuilder/app-core'
import { Page, Env } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import Sidebar from './side-bar'
import ErrorPage from './error-page'
import './style.scss'

const AppMain = () => {
	const location = useLocation()
	const { apps, window, isAppHidden, homeKey } = useSystemState( [ 'apps', 'window', 'isAppHidden', 'homeKey' ] )
	const side = window.origin[0]
	const sideName = side ? 'right' : 'left'
	const { isMobile } = Env.use()

	const classes = classname( {
		'fl-asst-main': true,
		'fl-asst-main-sidebar-only': isAppHidden,
		[`fl-asst-pinned-${sideName}`]: sideName,
		'fl-asst-is-mobile': isMobile,
	} )

	return (
		<div className={ classes } >
			<Sidebar edge={ sideName } />
			{ ! isAppHidden && (
				<div className="fl-asst-main-content" >
					<App.Content
						apps={ apps }
						defaultApp={ homeKey }
					/>
				</div>
			)}
		</div>
	)
}

/*
const AppContent = () => {
	useSystemState( 'apps' )
	const { app: appHandle } = useParams()
	const { selectApp } = getSystemSelectors()
	const app = selectApp( appHandle )

	// TEMP
	const isAppRoot = false

	if ( ! app ) {
		return <Page.NotFound />
	}

	// Subsequent app changes
	useEffect( () => app.onMount(), [ appHandle ] )

	const appWrapClasses = classname( {
		'fl-asst-screen-content': true,
		'fl-asst-app-content': true,
		[`fl-asst-app-${appHandle}`]: appHandle,
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
				<AppRoot root={ app.root } { ...props } />
			</Suspense>
		</div>
	)
}

const AppRoot = memo( ( { root: Root, ...rest } ) => {
	return Root ? <Root { ...rest } /> : <Page.NotFound />
} )
*/

export default AppMain
