import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { List, App, Page } from 'assistant/ui'


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

export const CommentTypeTab = ( { type = 'all', label = 'All Comments' } ) => {
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
