import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'
import { useLibrarySaveAction } from 'ui/library/use-save-action'
import { createSlug } from 'utils/url'

export const getPostActions = ( { history, values, setValue, createNotice, CloudUI } ) => {
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

	const clonePost = () => {
		wpRest
			.posts()
			.clone( id )
			.then( () => {
				createNotice( {
					id: 'clone-success',
					status: 'success',
					content: __( 'Post Duplicated!' )
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
							id: 'post-delete-success',
							status: 'success',
							content: __( 'Post permanently deleted!' )
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
		wpRest.posts().update( id, 'untrash' )
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
			label: contentTypes[type].labels.viewItem,
			href: url,
			shouldRender: contentTypes[type].canView
		},
		{
			label: __( 'Edit in Admin' ),
			href: editUrl,
		},
		{
			label: bbBranding,
			href: bbEditUrl,
			shouldRender: bbEditUrl && bbCanEdit,
		},
		{
			label: __( 'Duplicate' ),
			onClick: clonePost,
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
			label: 'Trash' === status ? __( 'Untrash' ) : __( 'Move to Trash' ),
			onClick: 'Trash' === status ? untrashPost : trashPost,
		},
	]
}
