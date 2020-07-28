import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import cloud from 'assistant/cloud'

import AppIcon from '../../icon'
import Actions from './actions'
import LibrariesFilter from './filter'
import LibrariesGrid from './grid'
import './style.scss'

export default () => {
	const { filter } = useAppState( 'fl-cloud-libraries', 'filter' )
	const { owner, ...query } = filter
	const [ teams ] = cloud.teams.useAll()
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
			<LibrariesFilter
				teams={ teams }
			/>
			<div className='fl-asst-libraries'>
				{ ( 'all' === owner || 'user' === owner ) &&
					<LibrariesGrid
						headline={ cloudUser.name }
						query={ query }
					/>
				}
				{ teams && teams.map( ( team, i ) => {
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
