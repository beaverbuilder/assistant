import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Layout } from 'ui'

export const PageNotFound = () => {
	return (
		<Page>
			<Layout.Headline>{__( 'Could not find page' )}</Layout.Headline>
		</Page>
	)
}
