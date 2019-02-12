import React from 'react'
import classname from 'classnames'
import { ContentListItem, Icon } from 'components'
import { truncate } from 'utils/text'
import './style.scss'

export const CommentsListItem = ( { className, data, ...props } ) => {
	const { approved } = data

	const classes = classname( className, {
		'fl-asst-comment-pending': ! approved,
	} )

	// Truncate title
	const title = truncate( data.title, 6 )
	const newData = Object.assign( {}, data, { title } )

	return (
		<ContentListItem className={ classes } data={ newData } { ...props }>
			{ ! approved &&
				<div className='fl-asst-comment-pending-icon'>
					<Icon name='red-dot' />
				</div>
			}
		</ContentListItem>
	)
}
