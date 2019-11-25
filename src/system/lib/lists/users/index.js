import React from 'react'
import { List } from 'lib'

export const Users = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest
} ) => {
	return (
		<List.WordPress
			className="fl-asst-user-list"
			type={ 'users' }
			query={ query }
			getItemProps={ ( item, defaultProps ) => {
				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: item.meta,
					thumbnail: item.thumbnail,
					thumbnailSize: 'med',
				} )
			} }
			{ ...rest }
		/>
	)
}
