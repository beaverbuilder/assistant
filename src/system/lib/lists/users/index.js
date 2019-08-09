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
				return getItemProps( item, {
					...defaultProps,
				} )
			} }
			{ ...rest }
		/>
	)
}
