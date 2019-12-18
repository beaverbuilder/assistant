import React from 'react'
import { List } from 'ui'

export const Comments = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	type = { type},
	query = {
		status: type,
	},
	...rest
} ) => {
	return (
		<List.WordPress
			type={ 'comments' }
			query={ query }
			getItemProps={ ( item, defaultProps ) => {
				return getItemProps( item, {
					...defaultProps,
					label: <em><strong>{item.authorEmail}</strong> commented:</em>,
					description: item.postTitle,
					thumbnail: item.thumbnail,
				} )
			} }
			{ ...rest }
		/>
	)
}
