import React from 'react'
import classname from 'classnames'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { App } from '@beaverbuilder/app-core'
import { Page, Env } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import Sidebar from './side-bar'
import './style.scss'

const AppMain = () => {
	const { apps, window: windowFrame, isAppHidden, homeKey } = useSystemState( [ 'apps', 'window', 'isAppHidden', 'homeKey' ] )
	const { origin, isHidden } = windowFrame
	const sideName = origin[0] ? 'right' : 'left'
	const { isMobile, application } = Env.use()
	const rowDirection = 'right' === sideName ? 'row-reverse' : 'row'
	const isBeaverBuilder = 'beaver-builder' === application
	const location = useLocation()
	const appHandle = location.pathname.split( '/' )[1]

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
			<Sidebar />
			{ displayContent && (
				<div className="fl-asst-main-content" >
					<App.Content
						apps={ apps }
						defaultApp={ homeKey }
						loading={ Page.Loading }
					/>
				</div>
			) }
		</div>
	)
}

export default AppMain
