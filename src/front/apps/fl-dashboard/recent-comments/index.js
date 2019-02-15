import React from 'react'
import {
	Widget,
	CommentList,
} from 'components'

export const RecentCommentsWidget = () => {
	return (
		<Widget title="Recent Comments" isPadded={ false }>
			<CommentList
				query={ { number: 5 } }
				placeholderItemCount={ 5 }
			/>
		</Widget>
	)
}
