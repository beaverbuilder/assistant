import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'assistant/ui'
import cloud from 'assistant/cloud'

import AppIcon from '../../icon'
import PageActions from './actions'
import LibrariesFilter from './filter'
import LibrariesGrid from './grid'

export default () => {
	const [ owner, setOwner ] = useState( null )
	const [ query, setQuery ] = useState( null )
	const [ teams ] = cloud.teams.useAll()
	const cloudUser = cloud.session.getUser()

	return (
		<Page
			title={ __( 'Libraries' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
			actions={ <PageActions /> }
			padX={ false }
			padY={ false }
		>
			<LibrariesFilter
				teams={ teams }
				onChange={ filter => {
					const { owner, ...rest } = filter
					setOwner( null === owner ? null : parseInt( owner ) )
					setQuery( rest )
				} }
			/>
			{ ! owner &&
				<LibrariesGrid
					headline={ cloudUser.name }
					query={ query }
				/>
			}
			{ teams && teams.map( ( team, i ) => {
				if ( null === owner || owner === team.id ) {
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
		</Page>
	)
}
