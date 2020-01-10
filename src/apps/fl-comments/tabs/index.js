import React, { useContext } from 'react'
import { List, App } from 'assistant/ui'


export const AllTab = () => {

	const { handle } = useContext( App.Context )

	return (
		<List.Comments
			type ="all"
			getItemProps={ ( item, defaultProps ) => ( {
				...defaultProps,
				to: {
					pathname: `/${handle}/comment/${item.id}`,
					state: { item }
				},
			} ) }
		/>
	)
}

export const CommentTypeTab = ( { type = 'all' } ) => {
	const { handle } = useContext( App.Context )


	return (
		<List.Comments
			type ={ type }
			getItemProps={ ( item, defaultProps ) => ( {
				...defaultProps,
				to: {
					pathname: `/${handle}/comment/${item.id}`,
					state: { item }
				},
			} ) }
		/>
	)
}
