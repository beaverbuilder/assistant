import React from 'react'
import { Layout } from 'assistant/ui'
import Members from './members'
import LibraryContext from '../context'

export default () => {
	const { library } = LibraryContext.use()
	const { owner_type, owner_id } = library

	return (
		<>
			<Layout.Box
				style={ {
					textAlign: 'center',
					padding: 0
				} }
			>
				<Layout.Headline style={{ margin: 10 }}>
					{ library.name }
				</Layout.Headline>

				{ library.description &&
					<div style={ { marginTop: 'var(--fluid-sm-space)' } }>
						{ library.description }
					</div>
				}
			</Layout.Box>

			{ 'team' === owner_type &&
				<Members teamId={ owner_id } />
			}
		</>
	)
}
