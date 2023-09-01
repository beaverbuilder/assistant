import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form, Layout, Notice, Button } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions, getSystemConfig, useSystemState } from 'data'
import { useLibrarySaveAction } from 'ui/library/use-save-action'
import { getCodeActions } from './actions'
import { getSiteLocations } from './locations'
import { Icon } from 'ui'
import './style.scss'

export const Code = ( { location, match, history, CloudUI } ) => {
	const { item } = location.state
	const wpRest = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()
	const { contentTypes } = getSystemConfig()
	const { createNotice } = Notice.useNotices()
	const { appearance } = useSystemState( [ 'appearance' ] )
	const mode = appearance.brightness
	const { id, type, subtype, title, description } = item
	const label = contentTypes[ item.type ].labels.singular

	const { saveToLibrary, LibraryDialog } = useLibrarySaveAction( {
		type: 'code',
		item,
		history,
		createNotice,
		CloudUI
	} )

	const EditableHeading = () => {

		const [ isEditing, setIsEditing ] = useState( false )
		const [ editedText, setEditedText ] = useState( title )

		const handleEdit = () => {
			setIsEditing( true )
		}

		const handleSave = () => {

			if( '' === editedText ) {
				return
			}

			const data = {
				post_title: editedText,
			}

			item.title = editedText
			setIsEditing( false )
			wpRest.posts().update( id, 'data', data ).then( () => {
				setCurrentHistoryState( { item } )
			} )
		}

		const handleTextChange = ( event ) => {
			setEditedText( event.target.value )
		}

		return (
			<div>
				{ isEditing ? (
					<div style={ { display: 'grid', gap: '10px' } }>
						<input
							type="text"
							id="title"
							value={ editedText }
							onChange={ handleTextChange }
						/>
						<button className="fluid-button fluid-appearance-normal" onClick={ handleSave }>{ __( 'Save' ) }</button>
					</div>
				) : (
					<div style={ { display: 'flex', alignItems: 'center' } } >
						<div className="fluid-detail-page-title-text">{ editedText }</div>
						<a className="fluid-button fluid-appearance-transparent edit-title-button" onClick={ handleEdit }>
							<Icon.Edit style={ { width: '16px', height: '16px' } } />
						</a>
					</div>
				) }
			</div>
		)
	}

	const EditableDesc = () => {

		const [ isEditing, setIsEditing ] = useState( false )
		const [ editedText, setEditedText ] = useState( description )

		const handleEdit = () => {
			setIsEditing( true )
		}

		const handleSave = () => {

			const data = {
				post_content: editedText,
			}

			item.description = editedText
			setIsEditing( false )
			wpRest.posts().update( id, 'data', data ).then( response => {
				const { data } = response
				setCurrentHistoryState( { item } )
			} )
		}

		const handleDescChange = (event) => {
			setEditedText( event.target.value )
		}

		return (
			<div>
				{ ! isEditing && <div>{ editedText }</div> }
				{ isEditing ? (
					<div style={ { display: 'grid', gap: '10px', paddingTop: '10px' } }>
						<textarea
							id='description'
							value={ editedText }
							onChange={ handleDescChange }
							style={ {
								maxWidth: '100%',
								minHeight: 100,
								resize: 'none'
							} }
						/>
						<button className="fluid-button fluid-appearance-normal" onClick={ handleSave }>{ __( 'Save' ) }</button>
					</div>
				) : (
					<div>
						<a className="edit-description" onClick={ handleEdit }>
							{ editedText ? __( 'Edit Description' ) : __( 'Add Description' ) }
						</a>
					</div>
				) }
			</div>
		)
	}

	const onSubmit = ( { changed, ids, setValue } ) => {

		const data = {
			meta: {},
		}

		if ( 'code' in changed ) {
			data.meta.code = changed.code
			item.code = changed.code
		}

		const handleError = error => {
			createNotice( {
				id: 'update-error',
				status: 'error',
				content: __( 'Error saving! Please try again.' )
			} )
			if ( error ) {
				console.log( error ) // eslint-disable-line no-console
			}
		}

		return wpRest
			.posts()
			.update( id, 'data', data )
			.then( response => {
				const { data } = response
				if ( data.error ) {
					handleError()
				} else {
					setCurrentHistoryState( { item } )
					createNotice( {
						id: 'update-success',
						status: 'success',
						content: __( 'Changes saved!' )
					} )
				}
			} )
			.catch( error => {
				handleError( error )
			} )
	}

	const sections = {
		meta: {
			fields: {
				title: {
					component: EditableHeading,
				},
				description: {
					component: EditableDesc,
				},
				code: {
					width: '400px',
					height: '500px',
					mode: mode,
					extension: 'css',
					component: 'code-editor',
					preview: true,
					className: 'fl-asst-code-editor'
				},
			},
		},
		locations: {
			label: __( 'Location' ),
			fields : args => getSiteLocations( { ...args } ),
		},
		actions: {
			label: __( 'Actions' ),
			fields: {
				actions: {
					component: 'actions',
					options: args => getCodeActions( { history, createNotice, CloudUI, ...args } ),
				},
			}
		},
	}

	const defaults = {
		...item,
		type: type
	}

	const {
		hasChanges,
		submitForm,
		renderForm,
		values,
	} = Form.useForm( {
		sections,
		onSubmit,
		defaults,
	} )

	const ToolbarActions = () => {
		return (
			<>
				<Button
					disabled={ ! hasChanges }
					isSelected={ hasChanges }
					onClick={ submitForm }
				>
					{ hasChanges ? __( 'Update' ) : __( 'Saved' ) }
				</Button>
			</>
		)
	}

	return (
		<Page.Detail
			id="fl-asst-code-detail"
			toolbarTitle={ sprintf( __( 'Edit %s' ), label ) }
			toolbarActions={ <ToolbarActions /> }
		>
			{ renderForm() }
			<LibraryDialog />
		</Page.Detail>
	)
}