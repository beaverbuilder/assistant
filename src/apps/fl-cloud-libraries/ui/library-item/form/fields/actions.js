import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import cloud from 'assistant/cloud'
import LibraryContext from '../../../library/context'
import ItemContext from '../../context'

export default ( {
	options = [],
} ) => {
	return (
		<>
			<Button.Group appearance='grid'>
				{ options.map( ( { label, ...rest }, i ) =>
					<Button key={ i } { ...rest }>
						{ label }
					</Button>
				) }
				<MoveButton />
				<DeleteButton />
			</Button.Group>
		</>
	)
}

const DeleteButton = () => {
	const history = useHistory()
	const { items, setItems } = LibraryContext.use()
	const { item } = ItemContext.use()
	const [ deleting, setDeleting ] = useState( false )

	const deleteItem = () => {
		if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
			setDeleting( true )
			cloud.libraries.deleteItem( item.id ).then( () => {
				setDeleting( false )
				setItems( items.filter( obj => obj.id !== item.id ) )
				history.goBack()
			} )
		}
	}

	return (
		<Button
			onClick={ deleteItem }
			disabled={ deleting }
			status='destructive'
		>
			{ __( 'Delete Item' ) }
		</Button>
	)
}

const MoveButton = () => {
	const { libraries, teams } = useAppState( 'fl-cloud-libraries', [ 'libraries', 'teams' ] )
	const { library, items, setItems } = LibraryContext.use()
	const { item, setItem, createNotice } = ItemContext.use()
	const [ moving, setMoving ] = useState( false )

	const moveItem = ( libraryId ) => {
		if ( ! libraryId ) {
			return
		}
		setMoving( true )
		cloud.libraries.moveItem( libraryId, item.id ).then( response => {
			setMoving( false )
			setItem( response.data )
			if ( libraryId === library.id ) {
				setItems( items.concat( [ item ] ) )
			} else {
				setItems( items.filter( obj => obj.id !== item.id ) )
			}
			createNotice( {
				id: 'import-success',
				status: 'success',
				content: __( 'Item moved!' )
			} )
		} )
	}

	return (
		<>
			<select
				value={ '' }
				onChange={ e => moveItem( parseInt( e.target.value ) ) }
				disabled={ moving }
				style={ {
					background: 'var(--fluid-transparent-12)',
					boxShadow: 'none',
					padding: 'var(--fluid-sm-space)',
					textAlignLast: 'center',
					cursor: 'pointer'
				} }
			>
				<option value=''>
					{ ! moving && __( 'Move To...' ) }
					{ moving && __( 'Moving...' ) }
				</option>
				{ libraries.user &&
					<optgroup label={ __( 'Your Libraries' ) }>
						{ libraries.user.map( ( { id, name }, i ) =>
							id !== item.library_id && <option key={ i } value={ id }>{ name }</option>
						) }
					</optgroup>
				}
				{ teams.map( ( { id, name }, i ) =>
					<optgroup key={ i } label={ name }>
						{ libraries.team[ id ] && libraries.team[ id ].map( ( { id, name }, i ) =>
							id !== item.library_id && <option key={ i } value={ id }>{ name }</option>
						) }
					</optgroup>
				) }
			</select>
		</>
	)
}
