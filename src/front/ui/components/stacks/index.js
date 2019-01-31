import React, { createContext, useState } from 'react'
import classname from 'classnames'
import { StackContext } from 'components'
import './style.scss'

export const Stack = ( { children, className } ) => {
	const [stack, setStack] = useState([])
	const classes = classname( {
		'fl-asst-view-stack': true,
	}, className )

	const context = {
		pushView: component => {
			console.log('push', component)
			const newStack = stack

		},
		popView: () => {
			console.log('pop')
		},
	}

	return (
		<StackContext.Provider value={context}>
			<div className={classes}>{children}</div>
		</StackContext.Provider>
	)
}
