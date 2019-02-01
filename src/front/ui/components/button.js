import React, { forwardRef } from 'react'
import posed from 'react-pose'
import classname from 'classnames'

export const Button = forwardRef( ( props, ref ) => {
	const { children, isSelected, onClick, className, style, appearance } = props
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-button-is-selected': isSelected,
		'fl-asst-button-transparent': 'icon' === appearance || 'transparent' === appearance
	}, className )
	return (
		<button type="button" className={classes} ref={ref} onClick={onClick} style={style}>{children}</button>
	)
} )

const PosedAppButton = posed.button({
	hoverable: true,
	focusable: true,
})

export const AppTabButton = forwardRef( ( props, ref ) => {
	const { children, isSelected, onClick, className, tooltip } = props
	const classes = classname( {
		'fl-asst-button': true,
		'fl-asst-app-tab-button': true,
		'fl-asst-button-is-selected': isSelected
	}, className )
	return (
		<PosedAppButton type="button" ref={ref} className={classes} onClick={onClick} title={tooltip}>{children}</PosedAppButton>
	)
} )
