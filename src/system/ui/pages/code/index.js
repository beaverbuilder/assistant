import React, { memo } from 'react'
import { __ } from '@wordpress/i18n'
import { useHistory } from 'react-router-dom'
import { Page, Form, Layout, Notice, Button } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions } from 'data'
import { useLibrarySaveAction } from 'ui/library/use-save-action'
import { getCodeActions } from './actions'
import './style.scss'

export const Code = ( { CloudUI } ) => {
	const history = useHistory()
	const { item } = history.location.state
	const wpRest = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()
	const { createNotice } = Notice.useNotices()
	const { id, type, subtype } = item

	const { saveToLibrary, LibraryDialog } = useLibrarySaveAction( {
		type: 'fl_css',
		item,
		history,
		createNotice,
		CloudUI
	} )

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

		if ( 'title' in changed ) {
			item.title = changed.title
		}

		if ( 'code' in changed ) {
			item.code = changed.code
			data.meta.code = changed.code
		}

		if ( 'description' in changed ) {
			item.description = changed.description
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
				title: {
					label: __( 'Title' ),
					id: 'post_title',
					component: 'text',
				},
				description: {
					label: __( 'Description' ),
					component: 'textarea',
					id: 'post_content',
					rows: 4,
				},
				code: {
					label: __( 'Code' ),
					component: 'textarea',
					id: 'fl_code',
					rows: 20,
				},
			},
		},
		// labels: {
		// 	label: __( 'Labels' ),
		// 	fields: {
		// 		labels: {
		// 			component: 'labels',
		// 			alwaysCommit: true,
		// 			onAdd: label => {
		// 				wpRest.code().addLabel( item.id, label.id )
		// 			},
		// 			onRemove: label => {
		// 				wpRest.code().removeLabel( item.id, label.id )
		// 			},
		// 		},
		// 	}
		// },
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
			toolbarTitle={ __( 'Edit Code' ) }
			toolbarActions={ <ToolbarActions /> }
			title={ values.title }
		>
			{ renderForm() }
			<LibraryDialog />
		</Page.Detail>
	)
}
