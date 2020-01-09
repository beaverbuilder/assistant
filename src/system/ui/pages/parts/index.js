import React, { useContext, useMemo } from 'react'
import classname from 'classnames'
import { Window, Page } from 'ui'
import { getSystemSelectors } from 'data'
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

export const RegisteredSections = ( { location, data } ) => {
	const { querySections } = getSystemSelectors()
	const sections = useMemo( () => querySections( location ), [ location ] )

	return sections.map( section => {
		const {
			handle,
			render,
			isEnabled,

			// Location & order are pulled out here to avoid being passed in ...rest
			location, // eslint-disable-line
			order, // eslint-disable-line

			...rest
		} = section


		if ( 'function' === typeof isEnabled && ! isEnabled( data ) ) {
			return null
		}

		return (
			<Page.Section key={ handle } handle={ handle } { ...rest }>{render( data )}</Page.Section>
		)
	} )
}

export const Empty = ( { children } ) => <div className="fl-asst-empty-page-message">{children}</div>
