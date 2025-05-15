import React from 'react'
import classname from 'classnames'
import { useLocation } from 'react-router-dom'
import { App } from '@beaverbuilder/app-core'
import { Page, Env, Modal } from 'assistant/ui'
import { useSystemState, getSystemConfig } from 'assistant/data'
import Sidebar from './side-bar'
import './style.scss'

const AppMain = () => {
	const { apps, window: windowFrame, isAppHidden, homeKey } = useSystemState( [ 'apps', 'window', 'isAppHidden', 'homeKey' ] )
	const { origin } = windowFrame
	const sideName = origin[0] ? 'right' : 'left'
	const { isMobile, application } = Env.use()
	const rowDirection = 'right' === sideName ? 'row-reverse' : 'row'
	const isBeaverBuilder = 'beaver-builder' === application
	const location = useLocation()
	const { isBBExtension } = getSystemConfig()
	const appHandle = ! isBBExtension ? location.pathname.split( '/' )[1] : 'bbapp'

	const classes = classname( {
		'fl-asst-main': true,
		'fl-asst-main-sidebar-only': isAppHidden,
		'fl-asst-is-mobile': isMobile,
		[ `fl-asst-app-${appHandle}` ]: appHandle
	} )

	//const displayContent = ! isAppHidden && ( ! isHidden || isBeaverBuilder )
	const displayContent = ! isAppHidden || isBeaverBuilder

	return (
		<div className={ classes } style={ { flexDirection: rowDirection } }>
			{ ! isBBExtension && <Sidebar /> }
			{ displayContent && (
				<div className="fl-asst-main-content" >
					<App.Content
						apps={ apps }
						defaultApp={ ! isBBExtension ? homeKey : 'bbapp' }
						loading={ Page.Loading }
					/>
				</div>
			) }
			<Modal.Root />
		</div>
	)
}

export default AppMain
