import React, { useMemo } from 'react'
import classname from 'classnames'
import { Page } from 'ui'
import { getSystemSelectors } from 'data'
import './style.scss'

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
