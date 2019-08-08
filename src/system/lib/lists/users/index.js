import React from 'fl-react'
import { List } from 'lib'

export const Users = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest,
} ) => {
	return (
		<List.WordPress
			type={ 'users' }
			query={ query }
			getItemProps={ ( item, defaultProps ) => {
				console.log(item)
				return getItemProps( item, {
					...defaultProps,
					thumbnail: item.thumbnail,
					label: item.title,
					description: item.meta,
				} )
			}}
			{ ...rest }
		/>
	)
}
