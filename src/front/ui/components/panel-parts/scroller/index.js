import React, { createContext, createRef, useContext } from 'react'
import classname from 'classnames'
import { FrameContext } from 'components'
import './style.scss'

export const ScrollContext = createContext( {
	ref: null,
} )

export const Scroller = props => {
	const { className, style: stylesProp } = props
	const classes = classname( {
		'fl-asst-scroller': true,
	}, className )

	const { height } = useContext( FrameContext )

	const ref = createRef()

	const context = {
		ref,
	}

	const style = {
		height,
		...stylesProp,
	}

	const merged = {
		...props,
		className: classes,
		ref,
		style,
	}

	return (
		<ScrollContext.Provider value={context}>
			<div {...merged} />
		</ScrollContext.Provider>
	)
}
