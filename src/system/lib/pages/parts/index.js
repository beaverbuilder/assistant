import React, { useContext } from 'fl-react'
import classname from 'fl-classnames'
import { Window } from 'lib'
import { getSystemSelectors } from 'store'
import './style.scss'

// Horizontal Toolbar - edge padding for controls
export const Toolbar = ( {
	className,
	shouldPadSides = true,
	shouldPadBottom = false,
	shouldPadTop = false,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-toolbar': true,
		'fl-asst-pad-top': shouldPadTop,
		'fl-asst-pad-sides': shouldPadSides,
		'fl-asst-pad-bottom': shouldPadBottom,
	}, className )
	return (
		<div className={ classes } { ...rest } />
	)
}

// Padded box
export const Pad = ( {
	className,
	top = true,
	sides = true,
	bottom = true,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-pad-top': top,
		'fl-asst-pad-sides': sides,
		'fl-asst-pad-bottom': bottom,
	}, className )

	return <div className={ classes } { ...rest } />
}

export const TitleCard = ( { className, title, children, ...rest } ) => {
	const classes = classname( {
		'fl-asst-card': true,
		'fl-asst-secondary-surface ': true,
	}, className )

	return (
		<div className={ classes } { ...rest }>
			{ title && <div className="fl-asst-card-title">{title}</div> }
			{children}
		</div>
	)
}

export const ExpandedContent = ( { children } ) => {
	const { size } = useContext( Window.Context )

	if ( 'normal' === size ) {
		return children
	}

	return null
}

export const Section = ( {
	children,
	className,
	label,
	handle,
	shouldPadSides = true,
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-section': true,
		[`'fl-asst-page-section-${handle}'`]: handle,
		'fl-asst-section-pad-sides': shouldPadSides,
	}, className )

	return (
		<div className={ classes } { ...rest }>
			{ label && <div className="fl-asst-section-title"><span className="fl-asst-section-title-text">{label}</span></div> }
			<div className="fl-asst-section-content">{children}</div>
		</div>
	)
}

export const RegisteredSections = ( { location, data } ) => {
	const { querySections } = getSystemSelectors()
	const sections = querySections( location )

	return sections.map( section => {
		const { handle, label, render } = section
		return (
			<Section key={ handle } label={ label }>{render( data )}</Section>
		)
	} )
}
