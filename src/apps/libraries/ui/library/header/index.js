import React from 'react'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Layout } from 'assistant/ui'

export default () => {
	const { library } = Libraries.LibraryContext.use()

	return (
		<>
			<Layout.Box
				style={ {
					textAlign: 'center',
					padding: 0
				} }
			>
				<Layout.Headline style={ { margin: 20 } }>
					{ library.name }
				</Layout.Headline>

				{ library.description &&
					<div style={ { lineHeight: 1.4 } }>
						{ library.description }
					</div>
				}
			</Layout.Box>

			<Libraries.LibraryMemberThumbs />
		</>
	)
}
