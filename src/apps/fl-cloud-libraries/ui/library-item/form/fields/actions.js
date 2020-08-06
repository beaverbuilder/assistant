import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import cloud from 'assistant/cloud'
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
	const { item } = ItemContext.use()
	const [ deleting, setDeleting ] = useState( false )

	const deleteItem = () => {
		if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
			setDeleting( true )
			cloud.libraries.deleteItem( item.id ).then( () => {
				setDeleting( false )
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
	const { item, createNotice } = ItemContext.use()
	const [ moving, setMoving ] = useState( false )

	const moveItem = ( libraryId ) => {
		if ( ! libraryId ) {
			return
		}
		setMoving( true )
		cloud.libraries.moveItem( libraryId, item.id ).then( () => {
			setMoving( false )
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
				{ libraries[0] &&
					<optgroup label={ __( 'Your Libraries' ) }>
						{ libraries[0].map( ( { id, name }, i ) =>
							<option key={ i } value={ id }>{ name }</option>
						) }
					</optgroup>
				}
				{ teams.map( ( { id, name }, i ) =>
					<optgroup key={ i } label={ name }>
						{ libraries[ id ] && libraries[ id ].map( ( { id, name }, i ) =>
							<option key={ i } value={ id }>{ name }</option>
						) }
					</optgroup>
				) }
			</select>
		</>
	)
}
