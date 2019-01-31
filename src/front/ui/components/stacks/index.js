import React, { createContext } from 'react'
import classname from 'classnames'
import './style.scss'

export const StackContext = createContext()
StackContext.displayName = 'StackContext'

export const Stack = ( { children } ) => {
	const classes = classname( {
		'fl-asst-view-stack': true,
	} )

	const context = {
		pushView: component => {},
		popView: () => {},
	}

	return (
		<StackContext.Provider value={context}>
			<div className={classes}>{children}</div>
		</StackContext.Provider>
	)
}
