import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'store'
import { getWpRest } from 'shared-utils/wordpress'

export const getPostActions = ( value, state, setValue ) => {
	const { currentUser, emptyTrashDays } = getSystemConfig()
	const wpRest = getWpRest()
	const {
		id,
		url,
		editUrl,
		status,
		trashedStatus,
		isFavorite,
		bbCanEdit,
		bbBranding,
		bbEditUrl
	} = state

	const favoritePost = () => {
		if ( isFavorite.value ) {
			wpRest.notations().deleteFavorite( 'post', id.value, currentUser.id )
		} else {
			wpRest.notations().createFavorite( 'post', id.value, currentUser.id )
		}
		setValue( 'isFavorite', ! isFavorite.value )
	}

	const clonePost = () => {
		wpRest.posts().clone( id.value ).then( response => {
			alert( 'Post Duplicated!' )
		} )
	}

	const trashPost = () => {
		if ( ! Number( emptyTrashDays ) ) {
			if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
				wpRest.posts().update( id.value, 'trash' ).then( () => {
					alert( 'Post permanently deleted!' )
				} )
			}
		} else if ( confirm( __( 'Do you really want to trash this item?' ) ) ) {
			wpRest.posts().update( id.value, 'trash' )
			setValue( 'trashedStatus', status.value )
			setValue( 'status', 'trash', true )
		}
	}

	const untrashPost = () => {
		wpRest.posts().update( id.value, 'untrash' )
		setValue( 'status', trashedStatus.value, true )
		setValue( 'trashedStatus', '' )
	}

	return [
		{
			label: __( 'View Post' ),
			href: url.value,
		},
		{
			label: __( 'Edit in Admin' ),
			href: editUrl.value,
		},
		{
			label: bbBranding.value,
			href: bbEditUrl.value,
			shouldRender: bbCanEdit.value,
		},
		{
			label: __( 'Duplicate' ),
			onClick: clonePost,
		},
		{
			label: isFavorite.value ? __( 'Unfavorite' ) : __( 'Mark as Favorite' ),
			onClick: favoritePost,
		},
		{
			label: 'trash' === status.value ? __( 'Untrash' ) : __( 'Move to Trash' ),
			onClick: 'trash' === status.value ? untrashPost : trashPost,
		}
	]
}
