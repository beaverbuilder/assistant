import React, { useState, useEffect } from 'react'
import classname from 'classnames'
import { CancelToken, isCancel } from 'axios'
import { __ } from '@wordpress/i18n'
import { List, Button, Icon } from 'ui'
import Clipboard from 'react-clipboard.js'
import { getWpRest } from 'utils/wordpress'
import { getSystemConfig } from 'data'

export const Posts = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest
} ) => {
	const [ labels, setLabels ] = useState( {} )
	const { currentUser, emptyTrashDays } = getSystemConfig()
	const wpRest = getWpRest()
	const source = CancelToken.source()

	useEffect( () => {

		// Get the color labels references
		wpRest.labels().findWhere( {}, {
			cancelToken: source.token,
		} ).then( response => {
			const items = {}
			if ( 'data' in response ) {
				for ( let i in response.data ) {
					const { id, ...rest } = response.data[i]
					items[id] = rest
				}
				setLabels( items )
			}
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )

		return () => source.cancel()
	}, [] )

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
						return <Button onClick={ restorePost } tabIndex="-1">{__( 'Restore' )}</Button>
					}
					return null
				}

				const Extras = () => {
					if ( item.isCloning || item.isTrashing || item.isTrashed || item.isRestoring ) {
						return null
					}
					return (
						<div className="fl-asst-item-extras">
							<Button
								title={ __( 'View Post' ) }
								tabIndex="-1"
								href={ item.url }
								appearance="transparent"
							>
								<Icon.View />
							</Button>
							<Clipboard
								button-tabIndex={ '-1' }
								button-className={ 'fluid-button fluid-appearance-transparent' }
								data-clipboard-text={ item.url }
							>
								<Icon.Link />
							</Clipboard>
							<Button
								onClick={ favoritePost }
								tabIndex="-1"
								title={ __( 'Mark as Favorite' ) }
								appearance="transparent"
							>
								{ item.isFavorite ? <Icon.BookmarkSolid /> : <Icon.Bookmark /> }
							</Button>
							<Button
								onClick={ clonePost }
								tabIndex="-1"
								title={ __( 'Duplicate' ) }
								appearance="transparent"
							>
								<Icon.Clone />
							</Button>
							<Button
								onClick={ trashPost }
								tabIndex="-1"
								title={ __( 'Move to Trash' ) }
								status='destructive'
								appearance="transparent"
							>
								<Icon.Trash />
							</Button>
						</div>
					)
				}

				const thumbnailSize = ( item.isTrashing || item.isTrashed || item.isRestoring ) ? 'sm' : 'med'

				const Title = () => {
					if ( item.isFavorite ) {
						return (
							<>
								{item.title}
							</>
						)
					}
					return item.title
				}

				const getMarks = item => {
					let marks = []

					if ( item.isTrashing || item.isTrashed || item.isRestoring ) {
						return []
					}

					if ( 'draft' === item.status ) {
						marks.push( 'DRAFT' )
					}
					if ( 'private' === item.status ) {
						marks.push( 'PRIVATE' )
					}

					if ( 'labels' in item && 0 < item.labels.length ) {

						item.labels.map( id => {
							if ( id in labels ) {
								const { color, label } = labels[id]
								marks.push(
									<span
										className="fl-asst-list-item-color-mark"
										style={ { background: color } }
										title={ label }
									></span>
								)
							}
						} )
					}

					if ( item.isFavorite ) {
						marks.push(
							<span>
								<Icon.Bookmark style={ { height: 12, width: 12, marginTop: 2 } } />
							</span>
						)
					}

					return marks
				}

				const isCurrentPage = () => item.url === location.href

				return getItemProps( item, {
					...defaultProps,
					label: <Title />,
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
						'fl-asst-is-transitioning': ( item.isCloning || item.isTrashing || item.isRestoring ),
						'fl-asst-is-current-page': isCurrentPage(),
					}, defaultProps.className ),
					marks: getMarks( item )
				} )
			} }
			{ ...rest }
		/>
	)
}
