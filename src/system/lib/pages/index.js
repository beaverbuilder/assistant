import React, { useContext } from 'fl-react'
import classname from 'classnames'
import { Window } from 'lib'
import './style.scss'

export const Page = ( {
	className,
	style: initialStyle,
	shouldPadTop = false,
	height = null,
	...rest
} ) => {
	const { size } = useContext( Window.Context )

	const classes = classname( {
		'fl-asst-page': true,
		'fl-asst-page-pad-top': shouldPadTop,
	}, className )

	// Calcuate max height
	let maxHeight = 'calc(100% - 46px)'

	const style = {
		...initialStyle,
		maxHeight,
	}
	return (
		<div className={classes} style={style} {...rest} />
	)
}
