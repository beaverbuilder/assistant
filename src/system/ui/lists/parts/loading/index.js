import React from 'react'
import { List, Layout } from 'ui'
import './style.scss'

const Loading = ( { count = 5, ...rest } ) => {
	return (
		<List
			items={ new Array( count ).fill( '' ) }
			getItemProps={ ( item, defaultProps ) => {
				return {
					...defaultProps,
					label: <Layout.Loading />,
					shouldAlwaysShowThumbnail: true,
					className: 'fl-asst-list-item-loading'
				}
			} }
			{ ...rest }
		/>
	)
}

export default Loading
