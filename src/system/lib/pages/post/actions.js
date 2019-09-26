import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'store'
import { getWpRest } from 'shared-utils/wordpress'

export const getPostActions = ( key, values, setValue ) => {
	const { contentTypes, currentUser, emptyTrashDays } = getSystemConfig()
	const wpRest = getWpRest()
	const {
		id,
		type,
		url,
		editUrl,
		status,
		trashedStatus,
		isFavorite,
		bbCanEdit,
		bbBranding,
		bbEditUrl
	} = values

	const favoritePost = () => {
		if ( isFavorite ) {
			wpRest.notations().deleteFavorite( 'post', id, currentUser.id )
		} else {
			wpRest.notations().createFavorite( 'post', id, currentUser.id )
		}
		setValue( 'isFavorite', ! isFavorite )
	}

	const clonePost = () => {
		wpRest.posts().clone( id ).then( () => {
			alert( 'Post Duplicated!' )
		} )
	}

	const trashPost = () => {
		if ( ! Number( emptyTrashDays ) ) {
			if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
				wpRest.posts().update( id, 'trash' ).then( () => {
					alert( 'Post permanently deleted!' )
				} )
			}
		} else if ( confirm( __( 'Do you really want to trash this item?' ) ) ) {
			wpRest.posts().update( id, 'trash' )
			setValue( 'trashedStatus', status )
			setValue( 'status', 'trash', true )
		}
	}

	const untrashPost = () => {
		wpRest.posts().update( id, 'untrash' )
		setValue( 'status', trashedStatus, true )
		setValue( 'trashedStatus', '' )
	}

	return [
		{
			label: contentTypes[ type ].labels.viewItem,
			href: url,
		},
		{
			label: __( 'Edit in Admin' ),
			href: editUrl,
		},
		{
			label: bbBranding,
			href: bbEditUrl,
			shouldRender: bbCanEdit,
		},
		{
			label: __( 'Duplicate' ),
			onClick: clonePost,
		},
		{
			label: isFavorite ? __( 'Unfavorite' ) : __( 'Mark as Favorite' ),
			onClick: favoritePost,
		},
		{
			label: 'trash' === status ? __( 'Untrash' ) : __( 'Move to Trash' ),
			onClick: 'trash' === status ? untrashPost : trashPost,
		}
	]
}
