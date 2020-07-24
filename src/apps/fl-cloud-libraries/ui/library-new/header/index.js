import React from 'react'
import { __ } from '@wordpress/i18n'
import { Layout } from 'assistant/ui'

export default ( { library } ) => {
	return (
		<Layout.Box
			style={ {
				textAlign: 'center'
			} }
		>
			<Layout.Headline>
				{ library.name }
			</Layout.Headline>
			{ library.description &&
				<div style={ { marginTop: 'var(--fluid-sm-space)' } }>
					{ library.description }
				</div>
			}
		</Layout.Box>
	)
}
