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

export const Padding = props => {
	const {
		className,
		top = '',
		bottom = '',
		left = '',
		right = '',
		style: initialStyles = {},
	} = props

	const classes = classname( {
		'fl-asst-padding': true
	}, className )

	const style = {
		...initialStyles,
		paddingTop: false === top ? 0 : top,
		paddingBottom: false === bottom ? 0 : bottom,
		paddingLeft: false === left ? 0 : left,
		paddingRight: false === right ? 0 : right,
	}

	const merged = {
		...props,
		className: classes,
		style,
		top: null,
		bottom: null,
		left: null,
		right: null,
	}

	return (
		<div {...merged}/>
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
			styles.maxHeight = 18
			break
		case 'dots-compact':
		case 'stripes':
			styles.flexBasis = 14
			styles.maxHeight = 14
			break
		case 'stripes-compact':
			styles.flexBasis = 8
			styles.maxHeight = 8
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
