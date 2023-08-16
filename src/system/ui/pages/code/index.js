import React, { memo, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { useHistory } from 'react-router-dom'
import { Page, Form, Layout, Notice, Button } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions, getSystemConfig } from 'data'
import { useLibrarySaveAction } from 'ui/library/use-save-action'
import { getCodeActions } from './actions'
import { getSiteLocations } from './locations'
import { Icon } from 'ui'
import './style.scss'

export const Code = ( { CloudUI } ) => {
	const history = useHistory()
	const { item } = history.location.state
	const wpRest = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()
	const { contentTypes } = getSystemConfig()
	const { createNotice } = Notice.useNotices()
	const { id, type, subtype } = item
	const label = contentTypes[ item.type ].labels.singular

	const { saveToLibrary, LibraryDialog } = useLibrarySaveAction( {
		type: 'fl_css',
		item,
		history,
		createNotice,
		CloudUI
	} )

	const EditableHeading = ( { initialText } ) => {

		const [isEditing, setIsEditing] = useState(false)
		const [editedText, setEditedText] = useState(initialText)

		const handleEdit = () => {
			setIsEditing(true)
		}

		const handleSave = () => {
			setIsEditing(false)
		}

		const handleTextChange = (event) => {
			setEditedText(event.target.value)
		}

		return (
			<div>
				{ isEditing ? (
					<div style={ { display: 'grid', gap: '10px' } }>
						<input
							type="text"
							value={ editedText }
							onChange={ handleTextChange }
						/>
						<button className="fluid-button fluid-appearance-normal" onClick={ handleSave }>{ __( 'Save' ) }</button>
					</div>
				) : (
					<div style={ { display: 'flex', alignItems: 'center' } } >
						<div className="fluid-detail-page-title-text">{ editedText }</div>
						<button className="fluid-button fluid-appearance-transparent edit-title-button" onClick={ handleEdit }>
							<Icon.Edit style={ { width: '16px', height: '16px' } } />
						</button>
					</div>
				) }
			</div>
		)
	}

	const EditableDesc = ( { initialText } ) => {

		const [isEditing, setIsEditing] = useState(false)
		const [editedDesc, setEditedDesc] = useState(initialText)

		const handleEdit = () => {
			setIsEditing(true)
		}

		const handleSave = () => {
			setIsEditing(false)
		}

		const handleDescChange = (event) => {
			setEditedDesc(event.target.value)
		}

		return (
			<div>
				{ ! isEditing && editedDesc && <div style={ { paddingTop: '10px' } }>{ editedDesc }</div> }
				{ isEditing ? (
					<div style={ { display: 'grid', gap: '10px', paddingTop: '10px' } }>
						<textarea
							value={ editedDesc }
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
					<div style={ { paddingTop: '10px' } }>
						<a style={ { textDecoration: 'underline' } } onClick={ handleEdit }>
							{ editedDesc ? __( 'Edit Description' ) : __( 'Add Description' ) }
						</a>
					</div>
				) }
			</div>
		)
	}

	const onSubmit = ( { changed, ids } ) => {

		const data = {
			meta: {},
		}
		for ( let key in changed ) {
			if ( ! ids[key] ) {
				continue
			}
			data[ids[key]] = changed[key]
		}

		if ( 'code' in changed ) {
			item.code = changed.code
			data.meta.code = changed.code
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
			.code()
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

	const deleteAttchment = () => {
		if ( confirm( __( 'Do you really want to delete this media?' ) ) ) {
			wpRest
				.code()
				.update( id, 'trash' )
				.then( () => {
					createNotice( {
						id: 'delete-success',
						status: 'success',
						content: __( 'Media Permanently Deleted!' )
					} )
				} )
			history.goBack()
		}
	}

	const sections = {
		meta: {
			fields: {
				code: {
					component: 'textarea',
					id: 'fl_code',
					rows: 20,
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
		type: type + '/' + subtype,
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
			<EditableHeading initialText={ values.title } />
			<EditableDesc initialText={ values.description } />
			{ renderForm() }
			<LibraryDialog />
		</Page.Detail>
	)
}
