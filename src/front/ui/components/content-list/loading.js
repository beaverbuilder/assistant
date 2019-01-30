import React from 'react'
import { ContentList } from './list'

export const ContentListLoading = ({ itemCount = 10 }) => {
	const data = Array( itemCount ).fill( {
		author: 'Loading...',
		title: 'Loading...',
	} )

	return (
		<ContentList
			data={ data }
			containerClass='fl-asst-list-loading'
			itemActions={ false }
		/>
	)
}
