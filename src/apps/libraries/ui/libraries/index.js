import React from 'react'
import { __ } from '@wordpress/i18n'
import { LibraryNav, formatItem, formatSection } from '@beaverbuilder/cloud-ui'
import { Page, Icon } from 'assistant/ui'
import { useAppState, useSystemState } from 'assistant/data'
import Actions from './actions'
import LibrariesFilter from './filter'
import LibrariesList from './list'

const getSections = ( user, teams, libraries ) => {

	const getItems = ( type = 'user', id = null ) => {
		const items = id ? libraries[ type ][ id ] : libraries[ type ]

		if ( ! items ) return []

		return items.map( formatItem )
	}

	const getTeamSections = ( teams = [] ) => {
		return teams.map( section => ( {
			...formatSection( section ),
			items: getItems( 'team', section.id ),
			canCreateLibraries: section.permissions.edit_libraries,
		} ) )
	}

	const communityLibs = getItems( 'access' )

	const sections = [
		{
			key: 'user',
			label: user ? user.name : '',
			avatar: user.avatar ? user.avatar.sizes.thumb.url : user.gravatar.md,
			to: '/libraries/user',
			items: getItems(),
			canCreateLibraries: true,
		},
		{
			key: 'shared',
			label: __( 'Shared Libraries' ),
			avatar: <Icon.Shared />,
			to: '/libraries/shared',
			isEnabled: !! libraries.shared.length,
			items: getItems( 'shared' ),
			canCreateLibraries: false,
		},
		{
			key: 'community',
			label: __("Community Libraries"),
			avatar: <Icon.Swirl />,
			isEnabled: !! communityLibs.length,
			items: communityLibs,
			canCreateLibraries: false,
		},
		...getTeamSections( teams )
	]

	return sections
}

export default () => {
	const { cloudUser } = useSystemState()
	const { filter, libraries, teams } = useAppState( 'libraries' )
	const { owner, ...query } = filter
	const isLoadingLibraries = false

	return (
		<Page
			title={ __( 'Libraries' ) }
			icon={ <Icon.Library context="sidebar" /> }
			shouldShowBackButton={ false }
			actions={ <Actions /> }
			padX={ false }
			padY={ false }
		>
			<LibraryNav
				sections={ getSections( cloudUser, teams, libraries ) }
				isLoading={ isLoadingLibraries }
				linkSectionHeaders={false}
				displayItemsAs="grid"
			/>
		</Page>
	)

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
