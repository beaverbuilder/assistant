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
		type: 'post',
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

	const trashPost = () => {

		if ( ! Number( emptyTrashDays ) ) {
			if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
				wpRest
					.posts()
					.update( id, 'trash' )
					.then( () => {
						createNotice( {
							id: 'code-delete-success',
							status: 'success',
							content: __( 'Code permanently deleted!' )
						} )
					} )
				history.goBack()
			}
		} else if ( confirm( __( 'Do you really want to trash this item?' ) ) ) {

			wpRest
				.posts().update( id, 'trash' )
				setValue( 'trashedStatus', status, true )
				setValue( 'status', 'trash', true )
		}
	}

	const untrashPost = () => {

		wpRest
			.posts().update( id, 'untrash' )
			setValue( 'status', trashedStatus, true )
			setValue( 'trashedStatus', '', true )
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
			label: 'trash' === status ? __( 'Untrash' ) : __( 'Move to Trash' ),
			onClick: 'trash' === status ? untrashPost : trashPost,
		},
	]
}
