import React, { useMemo } from 'react'
import { Page } from 'ui'
import { getSystemSelectors } from 'data'
import './style.scss'

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
