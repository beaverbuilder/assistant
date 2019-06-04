import React, { useContext } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
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
	const { present } = useContext( StackContext )

	const classes = classname( className, {
		'fl-asst-comment-pending': ! approved,
	} )

	return (
		<ContentListItem
			className={ classes }
			onClick={ () => present( {
				label: __( 'Edit Comment' ),
				content: <CommentDetail />,
				appearance: 'form',
				context,
			} ) }
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
