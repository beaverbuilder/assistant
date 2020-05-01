import React from 'react'
import { List } from 'assistant/ui'

export default ( { type = 'all' } ) => {
	const handle = '/fl-comments'
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
