import React from 'fl-react'
import { List } from 'lib'

export const Updates = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {
		updateType: 'all',
	},
	...rest,
} ) => {
	return (
		<List.WordPress
			type={ 'updates' }
			query={ query }
			isListSection={ item => 'undefined' !== typeof item.items }
			getSectionItems={ section => section.items }
			getItemProps={ ( item, defaultProps, isSection ) => {
				if ( isSection ) {
					return {
						...defaultProps,
						label: item.label
					}
				}
				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: item.meta,
					thumbnail: item.thumbnail,
				} )
			} }
			{ ...rest }
		/>
	)
}
