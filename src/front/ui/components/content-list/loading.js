import React from 'react'
import { ContentList } from './list'

export const ContentListLoading = () => {
	const data = Array( 10 ).fill( {
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
