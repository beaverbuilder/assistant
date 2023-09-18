import React, { useState, useEffect } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { List, Button, Icon } from 'ui'
import { getWpRest } from 'utils/wordpress'
import { getSystemConfig, getSystemSelectors } from 'data'
import CodeFile from './icon'

export const Code = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	listStyle = 'list',
	...rest
} ) => {
	const { getLabels } = getSystemSelectors()
	const [ labelsById, setLabelsById ] = useState( [] )
	const { emptyTrashDays } = getSystemConfig()
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

				const deleteCode = () => {
					const { id, uuid } = item

					if ( confirm( __( 'Do you really want to permanently delete this item?' ) ) ) {
						wpRest
							.posts()
							.delete( id, true )
							.then( () => {
								updateItem( uuid, {
									isTrashed: true,
								} )
								removeItem( uuid )
							} )
					}
				}

				const getDescription = () => {
					if ( item.author ) {
						return __( 'by' ) + ' ' + item.author
					} else if ( item.visibility ) {
						return item.visibility
					}
				}

				// Check if item is the current page being viewed
				const href = window.location.href.split( '?' )
				const isCurrentPage = () => item.url === href[0]

				const Extras = () => (
					<div className="fl-asst-item-extras">
						<Button
							title={ __( 'Duplicate' ) }
							tabIndex="-1"
							onClick={ clonePost }
							appearance="transparent"
						>
							<Icon.Clone />
						</Button>
						<Button
							onClick={ deleteCode }
							tabIndex="-1"
							title={ __( 'Move to Trash' ) }
							status='destructive'
							appearance="transparent"
						>
							<Icon.Trash />
						</Button>
					</div>
				)

				const Title = () => {
					return item.title
				}

				const getMarks = item => {
					let marks = []

					if ( item.isTrashing || item.isTrashed || item.isRestoring ) {
						return []
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

					if ( 'draft' === item.status ) {
						marks.push( __( 'Draft' ) )
					}
					if ( 'future' === item.status ) {
						marks.push( __( 'Scheduled' ) )
					}
					if ( 'private' === item.visibility ) {
						marks.push( __( 'Private' ) )
					}
					if ( 'protected' === item.visibility ) {
						marks.push( __( 'Protected' ) )
					}
					if ( item.isSticky ) {
						marks.push( __( 'Sticky' ) )
					}

					return marks
				}

				const isPending = item.isTrashing || item.isTrashed || item.isRestoring

				const props = getItemProps( item, {
					...defaultProps,
					label: <Title />,
					description: getDescription(),
					thumbnail: <CodeFile />,
					extras: Extras,
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
				return props
			} }
			{ ...rest }
		/>
	)
}
