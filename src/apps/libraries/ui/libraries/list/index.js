import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Layout, Text, Icon } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import './style.scss'

export default ( {
	headline = '',
	type = 'user',
	team = null,
} ) => {
	const { libraries, isLoadingLibraries } = useAppState( 'libraries' )
	const teamId = team ? team.id : 0
	const ownerLibraries = teamId ? libraries[ type ][ teamId ] : libraries[ type ]
	const hasLibraries = ownerLibraries && 0 < ownerLibraries.length
	const canAddNew = team ? team.permissions.edit_libraries : true
	const [ isAddingNew, setIsAddingNew ] = useState( false )

	return (
		<Layout.Box
			className='fl-asst-libraries-grid'
			padX={ false }
			padY={ false }
		>
			{ ! isAddingNew &&
				<Layout.Toolbar style={ { paddingLeft: 20 } }>
					<Text.Title>{ headline }</Text.Title>
					{ 'shared' !== type && canAddNew && (
						<Button
							appearance="transparent"
							shape="round"
							onClick={ () => setIsAddingNew( true ) }
							style={ { marginLeft: 'auto' } }
						>
							<Icon.PlusSmall />
						</Button>
					) }
				</Layout.Toolbar>
			}

			{ isAddingNew &&
				<Layout.Toolbar>
					<Libraries.LibraryInlineCreate team={ team } />
					<Button
						onClick={ () => setIsAddingNew( false ) }
						style={ { marginLeft: 5 } }
					>
						<Icon.CloseCompact />
					</Button>
				</Layout.Toolbar>
			}

			{ ! isLoadingLibraries && ! hasLibraries && (
				<Layout.Box style={ { textAlign: 'center' } }>
					{ __( 'You don\'t currently have any libraries. Create one to get started!' ) }
				</Layout.Box>
			) }

			<Libraries.LibrariesList
				type={ type }
				team={ team }
				maxItems={ 6 }
			/>
		</Layout.Box>
	)
}
