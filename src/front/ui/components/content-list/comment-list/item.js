import React, { useContext } from 'react'
import classname from 'classnames'
import { CommentDetail } from './detail'
import {
	ContentListItem,
	Icon,
	ItemContext,
	StackContext
} from 'components'

export const CommentListItem = ( { className, ...props } ) => {
	const context = useContext( ItemContext )
	const { approved } = context
	const { pushView } = useContext( StackContext )

	const classes = classname( className, {
		'fl-asst-comment-pending': ! approved,
	} )

	return (
		<ContentListItem
			className={ classes }
			onClick={ () => pushView( <CommentDetail />, { context } ) }
			{ ...props }
		>
			{ ! approved &&
				<div className='fl-asst-comment-pending-icon'>
					<Icon name='blue-dot' />
				</div>
			}
		</ContentListItem>
	)
}
