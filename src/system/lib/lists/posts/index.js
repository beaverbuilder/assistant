import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { List, Button, Icon } from 'lib'
import Clipboard from 'react-clipboard.js'
import { getWpRest } from 'shared-utils/wordpress'

export const Posts = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest,
} ) => {
	const { update, clone } = getWpRest().posts()

	return (
		<List.WordPress
			type={ 'posts' }
			query={ query }
			defaultItemProps={ {
				shouldAlwaysShowThumbnail: true
			} }
			getItemProps={ ( item, defaultProps ) => {
				const { removeItem, cloneItem } = defaultProps

				const clonePost = () => {
					//clone( item.id )
					cloneItem( {
						id: null,
						author: null,
						visibility: null,
						title: __( 'Cloning...' ),
					} )
				}

				const trashPost = () => {
					if ( confirm( __( 'Do you really want to trash this post?' ) ) ) {
						update( item.id, 'trash' )
						removeItem()
					}
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

				const Extras = () => {
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
								<Button tabIndex="-1">
									<Icon.Bookmark />
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

				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: getDescription(),
					thumbnail: item.thumbnail,
					thumbnailSize: 'med',
					extras: item.isCloning ? null : props => <Extras { ...props } />,
				} )
			} }
			{ ...rest }
		/>
	)
}
