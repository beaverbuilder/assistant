import React, { useContext } from 'fl-react'
import { List, Window } from 'lib'

export const Users = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest,
} ) => {
	const { size } = useContext( Window.Context )
	return (
		<List.WordPress
			type={ 'users' }
			query={ query }
			getItemProps={ ( item, defaultProps ) => {
				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: 'normal' === size ? item.meta : null,
					thumbnail: item.thumbnail,
					thumbnailSize: 'normal' === size ? 'med' : 'sm',
				} )
			} }
			{ ...rest }
		/>
	)
}
