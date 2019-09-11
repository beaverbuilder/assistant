import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'store'
import { getWpRest } from 'shared-utils/wordpress'

export const getPostActions = ( item ) => {
	const { currentUser, emptyTrashDays } = getSystemConfig()
	const wpRest = getWpRest()

	const favoritePost = () => {
		if ( item.isFavorite ) {
			wpRest.notations().deleteFavorite( 'post', item.id, currentUser.id )
		} else {
			wpRest.notations().createFavorite( 'post', item.id, currentUser.id )
		}
	}

	return [
		{
			label: __( 'View Post' ),
			href: item.url,
		},
		{
			label: __( 'Edit in Admin' ),
			href: item.editUrl,
		},
		{
			label: item.bbBranding,
			href: item.bbEditUrl,
			shouldRender: item.bbCanEdit,
		},
		{
			label: __( 'Duplicate' ),
			onClick: () => {},
		},
		{
			label: item.isFavorite ? __( 'Unfavorite' ) : __( 'Mark as Favorite' ),
			onClick: favoritePost,
		},
		{
			label: __( 'Move to Trash' ),
			onClick: () => {},
		}
	]
}
