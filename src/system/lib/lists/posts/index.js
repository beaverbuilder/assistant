import React from 'fl-react'
import { List, Button, Icon } from 'lib'
import { __ } from '@wordpress/i18n'
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
				const desc = 'by ' + item.author + ' | ' + item.visibility

				const clonePost = () => {
					clone( item.id )
					cloneItem()
				}

				const trashPost = () => {
					if ( confirm( __( 'Do you really want to trash this post?' ) ) ) {
						update( item.id, 'trash' )
						removeItem()
					}
				}

				const Extras = () => {
					return (
						<div className="fl-asst-item-extras">
							<div className="fl-asst-item-extras-left">
								<Button tabIndex="-1" href={ item.url }>{__( 'View' )}</Button>
								<Button tabIndex="-1" href={ item.editUrl }>{__( 'Edit' )}</Button>
								<Button tabIndex="-1">{__( 'Beaver Builder' )}</Button>
							</div>
							<div className="fl-asst-item-extras-right">
								<Button tabIndex="-1">
									<Icon.Link />
								</Button>
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
					description: desc,
					thumbnail: item.thumbnail,
					thumbnailSize: 'med',
					extras: props => <Extras { ...props } />,
				} )
			} }
			{ ...rest }
		/>
	)
}
