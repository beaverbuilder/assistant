import React from 'react'
import { __ } from '@wordpress/i18n'
import { Dialog } from 'ui'
import { getSystemConfig, useSystemState } from 'data'
import { getWpRest } from 'utils/wordpress'

export const getPostActions = ( { history, values, setValue, createNotice } ) => {
	const { contentTypes, currentUser, emptyTrashDays , cloudConfig} = getSystemConfig()
	const { isCloudConnected } = useSystemState()
	const wpRest = getWpRest()

	const {
		id,
		title,
		type,
		url,
		editUrl,
		status,
		trashedStatus,
		isFavorite,
		bbCanEdit,
		bbBranding,
		bbEditUrl,
	} = values

	const favoritePost = () => {
		if ( isFavorite ) {
			wpRest.notations().deleteFavorite( 'post', id, currentUser.id )
		} else {
			wpRest.notations().createFavorite( 'post', id, currentUser.id )
		}
		setValue( 'isFavorite', ! isFavorite, true )
	}

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
			wpRest.posts().update( id, 'trash' )
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
				link.download = title + '_' + id
				document.body.appendChild( link )
				link.onclick = function() {

					wpRest
						.posts().deleteExport( id ).then( response => {
							if ( response ) {
								document.body.removeChild( link )
							}
						} )
				}

				link.click()

			} )
	}

	const [ showLibraryDialog, LibraryDialog ] = Dialog.useDialog( {
		title: __( 'Save to Library' ),
		message: __( 'Select a library below to save this post.' ),
		buttons: [
			{
				label: __( 'Cancel' ),
				onClick: ( { closeDialog } ) => closeDialog()
			},
			{
				label: __( 'Save to Library' ),
				onClick: () => {},
				isSelected: true
			}
		]
	} )

	const [ showConnectDialog, ConnectDialog ] = Dialog.useDialog( {
		title: __( 'Connect to Assistant Pro' ),
		message: __( 'Libraries require a connection to Assistant Pro. Would you like to connect now?' ),
		buttons: [
			{
				label: __( 'Cancel' ),
				onClick: ( { closeDialog } ) => closeDialog()
			},
			{
				label: __( 'Connect' ),
				onClick: () => {
					const redirect = encodeURIComponent( window.location )
					window.location.href = `${ cloudConfig.appUrl }/login/connect?redirect=${ redirect }`
				},
				isSelected: true
			}
		]
	} )

	const saveToLibrary = () => {
		if ( isCloudConnected ) {
			showLibraryDialog()
		} else {
			showConnectDialog()
		}
	}

	return [
		{
			label: contentTypes[type].labels.viewItem,
			href: url,
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
					<ConnectDialog />
				</>
			),
			onClick: saveToLibrary
		},
		{
			label: __( 'Export' ),
			onClick: exportPost,
		},
		{
			label: isFavorite ? __( 'Unfavorite' ) : __( 'Mark as Favorite' ),
			onClick: favoritePost,
		},
		{
			label: 'Trash' === status ? __( 'Untrash' ) : __( 'Move to Trash' ),
			onClick: 'Trash' === status ? untrashPost : trashPost,
		},
	]
}
