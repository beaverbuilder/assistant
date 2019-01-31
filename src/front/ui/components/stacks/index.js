import React from 'react'
import classname from 'classnames'
import { StackContext } from 'components'
import './style.scss'

export const Stack = ( { children, className } ) => {

	const classes = classname( {
		'fl-asst-view-stack': true,
	}, className )

	const context = {
		pushView: () => {

			//console.log( 'push', component )

		},
		popView: () => {

			//console.log( 'pop' )
		},
	}

	return (
		<StackContext.Provider value={context}>
			<div className={classes}>{children}</div>
		</StackContext.Provider>
	)
}
