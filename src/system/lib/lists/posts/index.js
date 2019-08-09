import React, { useContext } from 'fl-react'
import { List, Window } from 'lib'

export const Posts = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest,
} ) => {
	const { size } = useContext( Window.Context )

	return (
		<List.WordPress
			type={ 'posts' }
			query={ query }
			defaultItemProps={ {
				shouldAlwaysShowThumbnail: true
			} }
			getItemProps={ ( item, defaultProps ) => {
				const desc = 'by ' + item.author + ' | ' + item.visibility
				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: 'normal' === size ? desc : null,
					thumbnail: item.thumbnail,
					thumbnailSize: 'normal' === size ? 'med' : 'sm',
				} )
			} }
			{ ...rest }
		/>
	)
}
