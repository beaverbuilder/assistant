import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page } from 'lib'

export const Term = () => {
	return (
		<Page title={ __( 'Edit Term' ) }>
			<Page.RegisteredSections
				location={ { type: 'term' } }
				data={ {} }
			/>
		</Page>
	)
}
