import React from 'fl-react'
import classname from 'fl-classnames'
import { __ } from '@wordpress/i18n'
import { List, Button, Icon } from 'lib'
import Clipboard from 'react-clipboard.js'
import { getWpRest } from 'shared-utils/wordpress'
import { getSystemConfig } from 'store'

export const Posts = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest,
} ) => {
	const wpRest = getWpRest()
	const { currentUser, emptyTrashDays } = getSystemConfig()

	return (
		<List.WordPress
			type={ 'posts' }
			query={ query }
			defaultItemProps={ {
				shouldAlwaysShowThumbnail: true
			} }
			getItemProps={ ( item, defaultProps ) => {
				const { cloneItem, updateItem, removeItem } = defaultProps

				const favoritePost = () => {
					if ( item.isFavorite ) {
						wpRest.notations().deleteFavorite( 'post', item.id, currentUser.id )
						updateItem( item.uuid, { isFavorite: false } )
					} else {
						wpRest.notations().createFavorite( 'post', item.id, currentUser.id )
						updateItem( item.uuid, { isFavorite: true } )
					}
				}

				const clonePost = () => {
					const clonedItem = cloneItem( item.uuid, {
						id: null,
						author: null,
						visibility: null,
						title: __( 'Cloning...' ),
						isCloning: true,
					} )
					if ( clonedItem ) {
						wpRest.posts().clone( item.id ).then( response => {
							updateItem( clonedItem.uuid, {
								...response.data,
								isCloning: false,
							} )
						} )
					}
				}

				const trashPost = () => {
					const { id, uuid } = item
					if ( ! Number( emptyTrashDays ) ) {
						if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
							removeItem( uuid )
							wpRest.posts().update( id, 'trash' )
						}
					} else if ( confirm( __( 'Do you really want to trash this item?' ) ) ) {
						updateItem( uuid, {
							id: null,
							title: __( 'Moving item to trash' ),
							author: null,
							visibility: null,
							isTrashing: true,
							trashedItem: Object.assign( {}, item ),
						} )
						wpRest.posts().update( id, 'trash' ).then( () => {
							updateItem( uuid, {
								title: __( 'This item has been moved to the trash' ),
								isTrashing: false,
								isTrashed: true,
							} )
						} )
					}
				}

				const restorePost = () => {
					updateItem( item.trashedItem.uuid, {
						title: __( 'Restoring item' ),
						isTrashed: false,
						isRestoring: true,
					} )
					wpRest.posts().update( item.trashedItem.id, 'untrash' ).then( () => {
						updateItem( item.trashedItem.uuid, {
							...item.trashedItem,
							isRestoring: false,
						} )
					} )
				}

				const getDescription = () => {
					if ( item.author && item.visibility ) {
						return __( 'by' ) + ' ' + item.author + ' | ' + item.visibility
					} else if ( item.author ) {
						return __( 'by' ) + ' ' + item.author
					} else if ( item.visibility ) {
						return item.visibility
					}
				}

				const Accessory = () => {
					if ( item.isTrashed ) {
						return <Button onClick={ restorePost } tabIndex="-1">Restore</Button>
					}
					return null
				}

				const Extras = () => {
					if ( item.isCloning || item.isTrashing || item.isTrashed || item.isRestoring ) {
						return null
					}
					return (
						<div className="fl-asst-item-extras">
							<div className="fl-asst-item-extras-left">
								<Button tabIndex="-1" href={ item.url }>{__( 'View' )}</Button>
								<Button tabIndex="-1" href={ item.editUrl }>{__( 'Edit' )}</Button>
								{ item.bbCanEdit &&
									<Button tabIndex="-1" href={ item.bbEditUrl }>{ item.bbBranding }</Button>
								}
							</div>
							<div className="fl-asst-item-extras-right">
								<Clipboard
									button-tabIndex={ '-1' }
									button-className={ 'fl-asst-button fl-asst-button-appearance-normal' }
									data-clipboard-text={ item.url }
								>
									<Icon.Link />
								</Clipboard>
								<Button onClick={ favoritePost } tabIndex="-1" className={ item.isFavorite ? 'fl-asst-is-favorite' : '' }>
									{ item.isFavorite ? <Icon.FavoriteSolid /> : <Icon.Favorite /> }
								</Button>
								<Button onClick={ clonePost } tabIndex="-1">
									<Icon.Clone />
								</Button>
								<Button onClick={ trashPost } tabIndex="-1" className="fl-asst-destructive">
									<Icon.Trash />
								</Button>
							</div>
						</div>
					)
				}

				const thumbnailSize = ( item.isTrashing || item.isTrashed || item.isRestoring ) ? 'sm' : 'med'

				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: getDescription(),
					thumbnail: item.thumbnail,
					thumbnailSize,
					accessory: props => <Accessory { ...props } />,
					extras: props => <Extras { ...props } />,
					className: classname( {
						'fl-asst-is-trashing': item.isTrashing,
						'fl-asst-is-trashed': item.isTrashed,
						'fl-asst-is-restoring': item.isRestoring,
						'fl-asst-is-isCloning': item.isCloning,
						'fl-asst-is-transitioning': ( item.isCloning || item.isTrashing || item.isRestoring )
					}, defaultProps.className )
				} )
			} }
			{ ...rest }
		/>
	)
}
