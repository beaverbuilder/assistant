import React, { memo } from 'react'
import classname from 'classnames'
import { useLocation, Redirect } from 'react-router-dom'
import { App, Nav, Page, Env } from 'assistant/ui'
import { useSystemState } from 'assistant/data'

import Sidebar from './side-bar'
import './style.scss'

const AppMain = () => {
	const location = useLocation()
	const { window, isAppHidden } = useSystemState()
	const side = window.origin[0]
	const sideName = side ? 'right' : 'left'
	const { isMobile } = Env.useEnvironment()

	const classes = classname( {
		'fl-asst-main': true,
		'fl-asst-main-sidebar-only': isAppHidden,
		[`fl-asst-pinned-${sideName}`]: sideName,
		'fl-asst-is-mobile': isMobile,
	} )

	const homeApp = 'fl-home'

	return (
		<div className={ classes } >
			<Sidebar edge={ sideName } />

			{ ! isAppHidden && (
				<div className="fl-asst-main-content">
					<Nav.Switch location={ location }>
						<Nav.Route exact path="/">
							<Redirect to={ `/${homeApp}` } />
						</Nav.Route>
						<Nav.Route path="/:app" component={ AppContent } />
						<Nav.Route component={ Page.NotFound } />
					</Nav.Switch>
				</div>
			)}
		</div>
	)
}
AppMain.displayName = 'AppMain'

const AppContent = props => {
	const { match } = props
	const { apps } = useSystemState()
	const { isAppRoot } = App.useApp()
	const { params: { app: appName } } = match
	const app = apps[appName]

	if ( 'undefined' === typeof app ) {
		return null
	}

	const appProps = {
		...props,
		...app,
	}

	const appWrapClasses = classname( {
		'fl-asst-screen-content': true,
		'fl-asst-app-content': true,
		[`fl-asst-app-${appName}`]: appName,
		'fl-asst-app-root': isAppRoot,
	} )

	return (
		<div className={ appWrapClasses }>
			<AppRoot root={ app.root } { ...appProps } />
		</div>
	)
}

const AppRoot = memo( ( { root, ...rest } ) => {
	return 'function' === typeof root ? root( rest ) : null
} )

export default AppMain
