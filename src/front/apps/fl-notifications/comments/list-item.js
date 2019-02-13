import React from 'react'
import classname from 'classnames'
import { ContentListItem, Icon } from 'components'

export const CommentsListItem = ( { className, data, ...props } ) => {
	const { approved } = data

	const classes = classname( className, {
		'fl-asst-comment-pending': ! approved,
	} )

	return (
		<ContentListItem className={ classes } data={ data } { ...props }>
			{ ! approved &&
				<div className='fl-asst-comment-pending-icon'>
					<Icon name='red-dot' />
				</div>
			}
		</ContentListItem>
	)
}
