import React from 'react'
import { Padding, ScreenHeader } from 'components'
import './style.scss'

export const CommentDetailView = ( { data } ) => {
	return (
		<div className='fl-asst-comment-detail'>
			<ScreenHeader title="Comment" />
			<Padding>
				<div className="fl-asst-comment-content" dangerouslySetInnerHTML={ { __html: data.content } } />
			</Padding>
		</div>
	)
}
