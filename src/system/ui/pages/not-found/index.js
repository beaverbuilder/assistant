import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'fluid/ui'

export const PageNotFound = () => {
	return (
		<Page title={ __( 'Page Not Found' ) }>
			<h1>{__( 'Could not find page' )}</h1>
		</Page>
	)
}
