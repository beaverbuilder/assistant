import React from 'react'
import classname from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import { App } from '@beaverbuilder/app-core'
import { Page, Env } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import Sidebar from './side-bar'
import './style.scss'

const AppMain = () => {
	const { apps, window: windowFrame, isAppHidden, homeKey } = useSystemState( [ 'apps', 'window', 'isAppHidden', 'homeKey' ] )
	const { origin } = windowFrame
	const sideName = origin[0] ? 'right' : 'left'
	const { isMobile } = Env.use()
	const rowDirection = 'right' === sideName ? 'row-reverse' : 'row'

	const classes = classname( {
		'fl-asst-main': true,
		'fl-asst-main-sidebar-only': isAppHidden,
		'fl-asst-is-mobile': isMobile,
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

	const displayContent = ! isAppHidden

	return (
		<div className={ classes } style={ { flexDirection: rowDirection } }>
			<Sidebar />
			<>
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
			</>
		</div>
	)
}

export default AppMain
