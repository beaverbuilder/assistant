import React from 'react'
import { List } from 'ui'
import './style.scss'

const Loading = () => {
	const items = [ 1, 2, 3, 4, 5 ]

	const Bar = () => (
		<div className="fl-asst-loading-bar">
			<div className="fl-asst-load-dot"></div>
			<div className="fl-asst-load-dot"></div>
			<div className="fl-asst-load-dot"></div>
		</div>
	)

	return (
		<List
			items={ items }
			getItemProps={ ( item, defaultProps ) => {
				return {
					...defaultProps,
					label: <Bar />,
					shouldAlwaysShowThumbnail: true,
				}
			} }
		/>
	)
}

export default Loading
