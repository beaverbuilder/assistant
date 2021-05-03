import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Icon } from 'assistant/ui'
import { useAppState, useSystemState } from 'assistant/data'

import Actions from './actions'
import LibrariesFilter from './filter'
import LibrariesList from './list'

export default () => {
	const { cloudUser } = useSystemState()
	const { filter, libraries, teams } = useAppState( 'libraries' )
	const { owner, ...query } = filter

	return (
		<Page
			title={ __( 'Libraries' ) }
			icon={ <Icon.Library context="sidebar" /> }
			shouldShowBackButton={ false }
			actions={ <Actions /> }
			padX={ false }
			padY={ false }
		>
			<LibrariesFilter />

			<div className='fl-asst-libraries'>
				{ ( 'all' === owner || 'user' === owner ) &&
					<LibrariesList
						headline={ cloudUser.name.endsWith( 's' ) ? `${ cloudUser.name }'` : `${ cloudUser.name }'s` }
						query={ query }
					/>
				}
				{ !! libraries.shared.length &&
					<LibrariesList
						headline={ __( 'Shared Libraries' ) }
						type='shared'
						query={ query }
					/>
				}
				{ teams.map( ( team, i ) => {
					if ( 'all' === owner || `team_${ team.id }` === owner ) {
						return (
							<LibrariesList
								key={ i }
								headline={ cloudUser.name.endsWith( 's' ) ? `${ team.name }'` : `${ team.name }'s` }
								type='team'
								team={ team }
								query={ query }
							/>
						)
					}
				} ) }
			</div>
		</Page>
	)
}
