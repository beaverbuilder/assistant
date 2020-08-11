import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import cloud from 'assistant/cloud'

import AppIcon from '../../icon'
import Actions from './actions'
import LibrariesFilter from './filter'
import LibrariesGrid from './grid'

export default () => {
	const { filter, teams, isLoadingLibraries } = useAppState( 'libraries' )
	const { owner, ...query } = filter
	const cloudUser = cloud.session.getUser()

	return (
		<Page
			title={ __( 'Libraries' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
			actions={ <Actions /> }
			padX={ false }
			padY={ false }
		>
			<LibrariesFilter />

			<div className='fl-asst-libraries'>
				{ ( 'all' === owner || 'user' === owner ) &&
					<LibrariesGrid
						headline={ cloudUser.name }
						query={ query }
						isFetching={ isLoadingLibraries }
					/>
				}
				{ teams.map( ( team, i ) => {
					if ( 'all' === owner || `team_${ team.id }` === owner ) {
						return (
							<LibrariesGrid
								key={ i }
								headline={ team.name }
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
