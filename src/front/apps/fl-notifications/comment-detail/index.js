import React, { Fragment } from 'react'
import { Button, Padding } from 'components'
import './style.scss'

export const CommentDetailView = ( { data, onClose } ) => {
	return (
		<div className='fl-asst-comment-detail'>
			<Padding>
				<p>Oh hayyyyy! Viewing comment { data.id }.</p>
				<Button onClick={ onClose }>Go Back</Button>
			</Padding>
		</div>
	)
}
