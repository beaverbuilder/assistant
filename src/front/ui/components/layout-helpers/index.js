import React from 'react'
import classname from 'classnames'
import './style.scss'

export const HorizontalGroup = ({ className, children }) => {
	const classes = classname({
		'fl-asst-hgroup': true
	}, className )
	return (
		<div className={classes}>{children}</div>
	)
}

export const VerticalGroup = ({ className, children }) => {
	const classes = classname({
		'fl-asst-vgroup': true
	}, className )
	return (
		<div className={classes}>{children}</div>
	)
}

export const Padding = ({ className, children }) => {
	const classes = classname({
		'fl-asst-padding-normal': true
	}, className )
	return (
		<div className={classes}>{children}</div>
	)
}

export const Separator = ({ isSlim }) => {
	const classes = classname({
		'fl-asst-separator' : true,
		'fl-asst-separator-slim' : isSlim,
	})
	return <hr className={classes} />
}

export const Heading = ({ children, level = 2, className }) => {
	const classes = classname({
		'fl-asst-heading' : true,
		[`fl-asst-heading-${level}`] : level
	}, className )
	return (
		<div className={classes}>{children}</div>
	)
}

export const AspectBox = ({ className, children, style }) => {
	const classes = classname({
		'fl-asst-aspect-box' : true,
	}, className )
	return (
		<div className={classes}>
			<div style={style}>{children}</div>
		</div>
	)
}
