import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout, Text, Form, Collection } from 'assistant/ui'
import { getAppHooks, useAppState } from 'assistant/data'
import cloud from 'assistant/cloud'
import LibraryInlineCreate from './inline-create'
import './style.scss'

export default ( {
	headline = '',
	team = null,
	query = null,
} ) => {
	const history = useHistory()
	const teamId = team ? team.id : 0
	const [ showAll, setShowAll ] = useState( false )
	const { useLibraries, useFilter } = getAppHooks( 'fl-cloud-libraries' )
	const [ libraries, setLibraries ] = useLibraries()
	const ownerLibraries = libraries[ teamId ]
	const hasLibraries = ownerLibraries && 0 < ownerLibraries.length

	const [ filter ] = useFilter()

	const canAddNew = team ? team.user_permissions.update : true
	const [ isAddingNew, setIsAddingNew ] = useState( false )
	const [ newName, setNewName ] = useState( '' )
	const [ loading, setLoading ] = useState( false )
	const maxItems = 4

	const createLibrary = () => {
		if ( ! newName ) {
			return
		}
		const data = {
			name: newName,
			team_id: teamId
		}
		setNewName( '' )
		setIsAddingNew( false )
		setLoading( true )

		cloud.libraries.create( data ).then( response => {
			ownerLibraries.unshift( response.data )
			setLibraries( { ...libraries, [ teamId ]: ownerLibraries } )
		} ).catch( error => {
			alert( __( 'Something went wrong. Please try again.' ) )
		} ).finally( () => {
			setLoading( false )
		} )
	}

	const deleteLibrary = id => {
		if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
			cloud.libraries.delete( id ).then( response => {
				const newOwnerLibraries = libraries[ teamId ].filter( lib => lib.id !== id )
				setLibraries( { ...libraries, [ teamId ]: newOwnerLibraries } )
			}).catch( error => {
				alert( __( 'Something went wrong. Please try deleting again.' ) )
			})
		}
	}

	return (
		<Layout.Box
			className='fl-asst-libraries-grid'
			padX={ false }
			padY={ false }
		>
			{ ! isAddingNew &&
				<Layout.Toolbar style={ { paddingLeft: 20 } }>

					<Text.Title>{ headline }</Text.Title>

					{ loading && <Icon.Loading style={ { marginLeft: 'auto' } } /> }

					{ canAddNew && ! loading && (
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
					<LibraryInlineCreate
						name={ newName }
						onInput={ e => setNewName( e.target.value ) }
						create={ createLibrary }
					/>
					<Button
						icon="close-compact"
						onClick={ () => {
							setIsAddingNew( false )
							setNewName( '' )
						} }
						style={ { marginLeft: 5 } }
					/>
				</Layout.Toolbar>
			}

			{ ! hasLibraries && ! loading && (
				<Layout.Box style={ { textAlign: 'center' } }>
					{ __( 'You don\'t currently have any libraries. Create one to get started!' ) }
				</Layout.Box>
			) }

			<Collection
				appearance={ filter.displayAs }
				maxItems={ ! showAll ? maxItems : null }
			>
				{ hasLibraries && ownerLibraries.map( ( library, i ) => {
					return (
						<Collection.Item
							key={ library.id }
							title={ library.name }
							thumbnail={true}
							thumbnailProps={{
								ratio: '4:3',
								style: {
									backgroundImage: `url(${library.thumb})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									borderRadius: 'var(--fluid-radius)',
								}
							}}
							onClick={ () => history.push( `/fl-cloud-libraries/${ library.id }` ) }
						>

							{ false && <Button icon="trash" onClick={ e => {
								e.stopPropagation()
								deleteLibrary( library.id )
							}} />}
						</Collection.Item>
					)
				}) }
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
