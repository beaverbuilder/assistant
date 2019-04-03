import React from 'react'
import { __ } from '@wordpress/i18n'
import { Widget, CommentList, NavBar } from 'components'
import './style.scss'

export const RecentCommentsWidget = () => {
	return (
		<Widget title={__( 'Recent Comments' )} isPadded={ false } className="fl-asst-recent-comments-widget">
			<CommentList
				query={ { number: 5 } }
				placeholderItemCount={ 5 }
			/>
		</Widget>
	)
}
