import React from 'react'
import { List } from 'assistant/ui'

export default ( { type = 'all', appHandle } ) => {
	return (
		<List.Comments
			type ={ type }
			getItemProps={ ( item, defaultProps ) => ( {
				...defaultProps,
				to: {
					pathname: `/${appHandle}/comment/${item.id}`,
					state: { item }
				},
			} ) }
		/>
	)
}
