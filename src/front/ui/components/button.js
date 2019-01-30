import React, { forwardRef } from 'react'
import classname from 'classnames'

export const Button = forwardRef( (props, ref) => {
	const { children, isSelected, onClick, className, style } = props
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-button-is-selected': isSelected
	}, className )
	return (
		<button className={classes} ref={ref} onClick={onClick} style={style}>{children}</button>
	)
} )

export const AppTabButton = forwardRef( (props, ref) => {
	const { children, isSelected, onClick, className, tooltip } = props
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-app-tab-button': true,
		'fl-asst-button-is-selected': isSelected
	}, className )
	return (
		<button className={classes} onClick={onClick} title={tooltip}>{children}</button>
	)
} )
