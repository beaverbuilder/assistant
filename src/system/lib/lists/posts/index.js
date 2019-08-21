import React from 'fl-react'
import { List, Button, Icon } from 'lib'
import { __ } from '@wordpress/i18n'

export const Posts = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest,
} ) => {

	return (
		<List.WordPress
			type={ 'posts' }
			query={ query }
			defaultItemProps={ {
				shouldAlwaysShowThumbnail: true
			} }
			getItemProps={ ( item, defaultProps ) => {
				const desc = 'by ' + item.author + ' | ' + item.visibility

				const Extras = () => {
					return (
						<div className="fl-asst-item-extras" onClick={ e => e.stopPropagation() }>
							<div className="fl-asst-item-extras-left">
								<Button tabIndex="-1">{__( 'View' )}</Button>
								<Button tabIndex="-1">{__( 'Edit' )}</Button>
								<Button tabIndex="-1">{__( 'Beaver Builder' )}</Button>
							</div>
							<div className="fl-asst-item-extras-right">
								<Button tabIndex="-1">
									<Icon.Link />
								</Button>
								<Button tabIndex="-1">
									<Icon.Bookmark />
								</Button>
								<Button tabIndex="-1">
									<Icon.Clone />
								</Button>
								<Button tabIndex="-1">
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
