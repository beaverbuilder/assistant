import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Layout, Text, Collection } from 'assistant/ui'
import { getAppHooks } from 'assistant/data'
import './style.scss'

export default ( {
	headline = '',
	type = 'user',
	team = null,
	isFetching = false,
} ) => {
	const history = useHistory()
	const [ showAll, setShowAll ] = useState( false )
	const { useLibraries, useFilter } = getAppHooks( 'libraries' )
	const [ libraries ] = useLibraries()
	const teamId = team ? team.id : 0
	const ownerLibraries = teamId ? libraries[ type ][ teamId ] : libraries[ type ]
	const hasLibraries = ownerLibraries && 0 < ownerLibraries.length
	const canAddNew = team ? team.permissions.edit_libraries : true
	const [ isAddingNew, setIsAddingNew ] = useState( false )
	const maxItems = 4
	const [ filter ] = useFilter()

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
							icon="plus-small"
							onClick={ () => setIsAddingNew( true ) }
							style={ { marginLeft: 'auto' } }
						/>
					) }
				</Layout.Toolbar>
			}

			{ isAddingNew &&
				<Layout.Toolbar>
					<Libraries.LibraryInlineCreate teamId={ teamId } />
					<Button
						icon="close-compact"
						onClick={ () => setIsAddingNew( false ) }
						style={ { marginLeft: 5 } }
					/>
				</Layout.Toolbar>
			}

			{ ! isFetching && ! hasLibraries && (
				<Layout.Box style={ { textAlign: 'center' } }>
					{ __( 'You don\'t currently have any libraries. Create one to get started!' ) }
				</Layout.Box>
			) }

			<Collection
				appearance={ filter.displayAs }
				maxItems={ ! showAll ? maxItems : null }
				isLoading={ isFetching }
			>
				{ hasLibraries && ownerLibraries.map( ( { id, name, media } ) => {
					const { thumb } = media
					return (
						<Collection.Item
							key={ id }
							title={ name }
							thumbnail={ true }
							thumbnailProps={ {
								ratio: '4:3',
								style: {
									backgroundImage: thumb && thumb.sizes ? `url(${ thumb.sizes.thumb.url })` : '',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									borderRadius: 'var(--fluid-radius)',
								}
							} }
							onClick={ () => history.push( `/libraries/${ id }` ) }
						/>
					)
				} ) }
			</Collection>

			{ hasLibraries && ownerLibraries.length > maxItems && (
				<ShowMoreButton
					isShowing={ showAll }
					toggle={ setShowAll }
				/>
			)}
		</Layout.Box>
	)
}

const ShowMoreButton = ( { isShowing = false, toggle = () => {} } ) => {
	return (
		<Layout.Box style={ { paddingTop: 0, alignItems: 'center' } }>
			<Button
				onClick={ () => toggle( ! isShowing ) }
			>
				{ isShowing ? __( 'Show Less' ) :  __( 'Show All' ) }
			</Button>
		</Layout.Box>
	)
}
