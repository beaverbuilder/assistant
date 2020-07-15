import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Icon } from 'ui'

export const PageNotFound = () => {
	return (
		<Page toolbar={ false }>
			<div style={ { margin: 'auto', textAlign: 'center' } }>
				<Icon.Pencil />
				<h1>{__( 'Ooops!' )}</h1>
				<p>{__( 'We couldn\'t find that page. Try another.' )}</p>
			</div>
		</Page>
	)
}
