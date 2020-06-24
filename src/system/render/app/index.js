import React from 'react'
import classname from 'classnames'
import { App } from '@beaverbuilder/app-core'
import { Env } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import Sidebar from './side-bar'

//import ErrorPage from './error-page'
import './style.scss'

const AppMain = () => {
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

export default AppMain
