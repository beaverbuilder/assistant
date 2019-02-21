import React from 'react'
import { Widget, CommentList } from 'components'
import './style.scss'

export const RecentCommentsWidget = () => {
	return (
		<Widget title="Recent Comments" isPadded={ false } className="fl-asst-recent-comments-widget">
			<CommentList
				query={ { number: 5 } }
				placeholderItemCount={ 5 }
			/>
		</Widget>
	)
}
