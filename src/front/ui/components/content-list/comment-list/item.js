import React, { useContext } from 'react'
import classname from 'classnames'
import { truncate } from 'utils/text'
import { ContentListItem, Icon, StackContext } from 'components'
import { CommentListDetail } from './detail'

export const CommentListItem = ( { className, data, ...props } ) => {
	const { pushView } = useContext( StackContext )
	const { approved } = data
	const title = truncate( data.title, 6 )
	const newData = Object.assign( {}, data, { title } )

	const classes = classname( className, {
		'fl-asst-comment-pending': ! approved,
	} )

	return (
		<ContentListItem
			className={ classes }
			data={ newData }
			onClick={ () => pushView( <CommentListDetail data={ data } /> ) }
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
