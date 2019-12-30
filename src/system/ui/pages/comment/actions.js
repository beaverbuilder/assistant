import React from 'react'
import { getWpRest } from 'utils/wordpress'
import { Icon } from 'ui'

export const getCommentActions = ( { item } ) => {

	const {
		id,
		url,
		editUrl,
		approved,
	} = item
	const comments = getWpRest()
	const [ responseMessage, set_responseMessage ] = React.useState( {
		message: '',
		status: '',
		icon: ''
	} )

	const [ approveStatus, set_approveStatus ] = React.useState( approved )


	const approveComment = () => {
		comments
			.comments()
			.update( id, 'approve', item )
			.then( response => {
				if ( '1' == response.data.commentData.comment_approved ) {
					set_responseMessage( {
						message: 'Comment Approved!',
						status: 'alert',
						icon: Icon.Approve
					} )
					set_approveStatus( true )

				}
			} )
	}


	return [
		{ label: 'View on Post', href: url },
		{ label: 'View on Admin', href: editUrl },
		{ label: 'Approve', onClick: approveComment },
		{ label: 'Reject' },
		{ label: 'Mark as Spam' },
		{ label: 'UnSpam' },
		{ label: 'Reply' },
		{ label: 'Trash Comment', status: 'destructive' },
		{ label: 'Restore' }
	]
}
