import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'lib'

export const PageNotFound = () => {
	return (
		<Page>
			<h1>{__( 'Could not find page' )}</h1>
		</Page>
	)
}
