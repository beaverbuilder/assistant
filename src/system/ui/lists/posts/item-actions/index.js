import React from 'react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { applyFilters } from 'hooks'
import { Button, Icon } from 'ui'

const ItemActions = ( {
	item,
	clonePost,
	trashPost,
	favoritePost,
	isCurrentPage,
} ) => {

	if (
		item.isCloning ||
        item.isTrashing ||
        item.isTrashed ||
        item.isRestoring
	) {
		return null
	}

	const defaultAction = {
		handle: '',
		icon: <Icon.Placeholder />,
		isShowing: true,
		component: Button,
		appearance: 'transparent',
		tabIndex: -1,
	}

	const actions = applyFilters( 'list-item-actions', [
		{
			handle: 'view-post',
			href: item.url,
			title: __( 'View Post' ),
			icon: <Icon.View />,
			isShowing: ! isCurrentPage()
		},
		{
			handle: 'edit-post',
			title: __( 'Edit in Admin' ),
			href: item.editUrl,
			icon: <Icon.Edit />,
			isShowing: item.editUrl
		},
		{
			handle: 'clone-post',
			title: __( 'Duplicate' ),
			onClick: clonePost,
			icon: <Icon.Clone />,
		},
		{
			handle: 'favorite-post',
			title: __( 'Mark as Favorite' ),
			onClick: favoritePost,
			icon: item.isFavorite ? <Icon.BookmarkSolid /> : <Icon.Bookmark />,
		},
		{
			handle: 'trash-post',
			title: __( 'Move to Trash' ),
			onClick: trashPost,
			status: 'destructive',
			icon: <Icon.Trash />,
		},
	], item )

	return (
		<div className="fl-asst-item-extras">
			{ actions.map( ( item, i ) => {
				const action = { ...defaultAction, ...item }
				const {
					component: Component,
					isShowing,
					icon,
					handle,
					className,
					...rest
				} = action

				if ( 'function' === typeof isShowing && ! isShowing( item ) ) {
					return null
				} else if ( ! isShowing ) {
					return null
				}

				const classes = classname( {
					[`fl-asst-item-action-${handle}`]: handle,
				}, className )

				return (
					<Component
						key={ i }
						className={ classes }
						{ ...rest }
					>{icon}</Component>
				)
			} )}
		</div>
	)
}

export default ItemActions
