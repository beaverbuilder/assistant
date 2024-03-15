import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'
import { useLibrarySaveAction } from 'ui/library/use-save-action'
import { createSlug } from 'utils/url'

export const getCodeActions = ( { history, values, setValue, createNotice, CloudUI } ) => {
	const { contentTypes, currentUser, emptyTrashDays } = getSystemConfig()
	const wpRest = getWpRest()

	const { saveToLibrary, LibraryDialog } = useLibrarySaveAction( {
		type: 'code',
		item: values,
		history,
		createNotice,
		CloudUI
	} )

	const {
		id,
		title,
		type,
		url,
		editUrl,
		status,
		trashedStatus,
		bbCanEdit,
		bbBranding,
		bbEditUrl,
	} = values

	const cloneCode = () => {
		wpRest.posts()
			.clone( id )
			.then( () => {
				createNotice( {
					id: 'clone-success',
					status: 'success',
					content: __( 'Code Duplicated!' )
				} )
			} )
	}

	const deleteCode = () => {
		if ( confirm( __( 'Do you really want to permanently delete this item?' ) ) ) {

			wpRest
				.posts()
				.delete( id, true )
				.then( () => {
					createNotice( {
						id: 'code-delete-success',
						status: 'success',
						content: __( 'Code permanently deleted!' )
					} )
				} )
			// history.goBack()
		}
	}

	const exportPost = () => {

		wpRest
			.posts()
			.export( id )
			.then( response => {
				const link = document.createElement( 'a' )
				link.href = response.data
				link.download = createSlug( title ) + '_' + id + '.xml'
				document.body.appendChild( link )
				link.click()
			} )
	}

	return [
		{
			label: __( 'Duplicate' ),
			onClick: cloneCode,
		},
		{
			label: (
				<>
					<span>{ __( 'Save to Library' ) }</span>
					<LibraryDialog />
				</>
			),
			onClick: saveToLibrary,
		},
		{
			label: __( 'Export' ),
			onClick: exportPost,
		},
		{
			label: __( 'Delete' ),
			onClick: deleteCode,
		},
	]
}
