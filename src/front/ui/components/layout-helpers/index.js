import React from 'react'
import classname from 'classnames'
import { Pattern } from 'components'
import './style.scss'

export const HorizontalGroup = ( { className, children } ) => {
	const classes = classname( {
		'fl-asst-hgroup': true
	}, className )
	return (
		<div className={classes}>{children}</div>
	)
}

export const VerticalGroup = ( { className, children } ) => {
	const classes = classname( {
		'fl-asst-vgroup': true
	}, className )
	return (
		<div className={classes}>{children}</div>
	)
}

export const Padding = ( { className, children, style } ) => {
	const classes = classname( {
		'fl-asst-padding-normal': true
	}, className )
	return (
		<div className={classes} style={style}>{children}</div>
	)
}

export const Separator = props => {
	const { isSlim, appearance = 'stripes-compact' } = props
	const classes = classname( {
		'fl-asst-separator': true,
		'fl-asst-separator-slim': isSlim,
	} )

	// dots-compact 14, dots 18
	let styles = {}
	if ( ! isSlim ) {
		switch ( appearance ) {
			case 'dots':
				styles.flexBasis = 18
				break
			case 'dots-compact':
			case 'stripes':
				styles.flexBasis = 14
				break
			case 'stripes-compact':
				styles.flexBasis = 8
				break
			default:
		}
	}

	const merged = {
		...props,
		style: styles,
		className: classes,
	}
	delete merged.isSlim

	if ( isSlim ) {
		return <hr {...merged} />
	}

	return (
		<div {...merged}>
			<Pattern name={appearance} />
		</div>
	)
}

export const Heading = ( { children, level = 2, className } ) => {
	const classes = classname( {
		'fl-asst-heading': true,
		[`fl-asst-heading-${level}`]: level
	}, className )
	return (
		<div className={classes}>{children}</div>
	)
}

export const AspectBox = ( { className, children, style } ) => {
	const classes = classname( {
		'fl-asst-aspect-box': true,
	}, className )
	return (
		<div className={classes}>
			<div style={style}>{children}</div>
		</div>
	)
}
