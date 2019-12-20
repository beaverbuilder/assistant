import React from 'react'
import { List } from 'ui'
import { truncate } from 'utils/text'

export const Comments = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	type = { type },
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
					description: truncate(item.content.replace(/<\/?[^>]+(>|$)/g, ""),80),
					thumbnail: item.thumbnail,
				} )
			} }
			{ ...rest }
		/>
	)
}
