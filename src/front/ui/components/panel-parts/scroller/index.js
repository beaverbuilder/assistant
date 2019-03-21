import React, { createContext, createRef } from 'react'
import classname from 'classnames'
import './style.scss'

export const ScrollContext = createContext( {
	ref: null,
} )

export const Scroller = props => {
	const { className } = props
	const classes = classname( {
		'fl-asst-scroller': true,
	}, className )

	const ref = createRef()

	const context = {
		ref,
	}

	const merged = {
		...props,
		className: classes,
		ref,
	}

	return (
		<ScrollContext.Provider value={context}>
			<div {...merged} />
		</ScrollContext.Provider>
	)
}
