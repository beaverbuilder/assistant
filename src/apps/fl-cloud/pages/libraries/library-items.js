import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout } from 'assistant/ui'

export default ( { library } ) => {
	return (
		<Layout.Box
			style={ {
				textAlign: 'center',
				justifyContent: 'center'
			} }
		>
			<div style={ { marginBottom: 'var(--fluid-lg-space)' } }>
				{ __( "This library doesn't have any items yet." ) }
			</div>
			<div>
				<Button to={ `/fl-cloud/libraries/${ library.id }/items/new` }>
					{ __( 'Add Items' ) }
				</Button>
			</div>
		</Layout.Box>
	)
}
