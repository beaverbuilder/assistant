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

	const variants = {
		collapsed: ( { sideName } ) => ( {
			originX: 'right' === sideName ? 1 : 0,
			x: 'right' === sideName ? 100 : -100
		} ),
		expanded: ( { sideName } ) => ( {
			originX: 'right' === sideName ? 1 : 0,
			x: 0
		} ),
	}

	const displayContent = ! isAppHidden && ( ! isHidden || isBeaverBuilder )

	return (
		<div className={ classes } style={ { flexDirection: rowDirection } }>
			<Sidebar />
			<AnimatePresence initial={ false }>
				{ displayContent && (
					<motion.div
						key="main-content"
						variants={ variants }
						initial="collapsed"
						animate="expanded"
						exit="collapsed"
						transition={ { type: 'tween', duration: 0 } }
						custom={ { sideName } }
						className="fl-asst-main-content"
					>
						<App.Content
							apps={ apps }
							defaultApp={ homeKey }
							loading={ Page.Loading }
						/>
					</motion.div>
				) }
			</AnimatePresence>
		</div>
	)
}

export default AppMain
