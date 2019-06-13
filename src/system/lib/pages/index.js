import React from 'fl-react'
import classname from 'classnames'
import './style.scss'

export const Page = ( {
	className,
	style: initialStyle,
	shouldPadTop = false,
	height = null,
	...rest
} ) => {

	const classes = classname( {
		'fl-asst-page': true,
		'fl-asst-page-pad-top': shouldPadTop,
	}, className )

	const style = {
		...initialStyle,
	}
	return (
		<div className={classes} style={style} {...rest} />
	)
}
