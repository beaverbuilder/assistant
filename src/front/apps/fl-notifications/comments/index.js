import React, { Fragment } from 'react'
import { Button, Padding, Separator } from 'components'
import './style.scss'

export const CommentDetailView = ( { data, onClose } ) => {
	return (
		<div className='fl-asst-comment-detail'>
			<Padding>
				<div className="fl-asst-comment-content" dangerouslySetInnerHTML={ { __html: data.title } } />
				<Button onClick={ onClose }>Go Back</Button>
			</Padding>
		</div>
	)
}
