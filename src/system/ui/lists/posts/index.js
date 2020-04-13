import React, { useState, useEffect } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { List, Button, Icon, Layout } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSrcSet } from 'utils/image'
import { getSystemConfig, getSystemSelectors } from 'data'
import { applyFilters } from 'hooks'
import ItemActions from './item-actions'

export const Posts = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	listStyle = 'list',
	...rest
} ) => {
	const { getLabels } = getSystemSelectors()
	const [ labelsById, setLabelsById ] = useState( [] )
	const { currentUser, emptyTrashDays } = getSystemConfig()
	const wpRest = getWpRest()
	const labels = getLabels()

	// Retrieve labels by ID
	useEffect( () => {
		const items = {}
		labels.map( label => items[ label.id ] = label )
		setLabelsById( items )
	}, [ labels ] )

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

				const isCurrentPage = () => item.url === window.location.href

				const Accessory = () => {
					if ( item.isTrashed ) {
						return <Button onClick={ restorePost } tabIndex="-1">{__( 'Restore' )}</Button>
					}
					return null
				}

				const Extras = () => (
					<ItemActions
						item={ item }
						clonePost={ clonePost }
						trashPost={ trashPost }
						favoritePost={ favoritePost }
						isCurrentPage={ isCurrentPage }
					/>
				)

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

					if ( 'labels' in item && 0 < item.labels.length ) {

						item.labels.map( id => {
							if ( id in labelsById ) {
								const { color, label } = labelsById[id]
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

				const isPending = item.isTrashing || item.isTrashed || item.isRestoring

				const props = getItemProps( item, {
					...defaultProps,
					label: <Title />,
					description: getDescription(),
					thumbnail: 'thumb' !== listStyle && item.thumbnail,
					thumbnailSize,
					shouldAlwaysShowThumbnail: 'thumb' !== listStyle && ! isPending,
					accessory: props => <Accessory { ...props } />,
					extras: Extras,
					className: classname( {
						'fl-asst-is-trashing': item.isTrashing,
						'fl-asst-is-trashed': item.isTrashed,
						'fl-asst-is-restoring': item.isRestoring,
						'fl-asst-is-isCloning': item.isCloning,
						'fl-asst-is-transitioning': ( item.isCloning || item.isTrashing || item.isRestoring ),
						'fl-asst-is-current-page': isCurrentPage(),
					}, defaultProps.className ),
					marks: getMarks( item ),
					before: 'thumb' === listStyle && <BigThumbnail item={ item } />
				} )

				const filterArgs = {
					item,
					defaultProps,
					isPending,
					restorePost,
					trashPost,
					favoritePost,
					clonePost,
				}

				return applyFilters( 'list-item-props', props, filterArgs )
			} }
			{ ...rest }
		/>
	)
}

const BigThumbnail = ( { item } ) => {
	if ( ! item.thumbnail ) {
		return null
	}

	const {
		thumbnail,
		sizes,
		alt,
		title,
		height,
		width
	} = item.thumbnailData
	const srcset = getSrcSet( sizes )

	// This sets up an aspect-ratio box around the image to prevent height changing during img load
	return (
		<div style={ { padding: '0 var(--fluid-lg-space) var(--fluid-med-space)' } }>
			<Layout.AspectBox width={width} height={height}>
				<img
					src={ thumbnail }
					srcSet={ srcset }
					alt={ alt }
					title={ title }
					height={ height }
					width={ width }
					loading="lazy"
				/>
			</Layout.AspectBox>
		</div>
	)
}
