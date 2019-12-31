import React from 'react'
import { getWpRest } from 'utils/wordpress'
import { Icon } from 'ui'
import { getSystemActions } from 'data'

export const getCommentActions = ( {
	set_approveStatus, set_responseMessage, set_spamStatus, set_trashStatus, set_commentStatus, item } ) => {

	const {
		id,
		url,
		editUrl,
		approved,
		spam,
		trash,
	} = item
	const comments = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()
	const [ actionApprove, set_actionApprove ] = React.useState( approved )
	const [ actionSpam, set_actionSpam ] = React.useState( spam )
	const [ actionTrash, set_actionTrash ] = React.useState( trash )


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
					set_actionApprove( true )
					item.approved = true
					setCurrentHistoryState( { item } )

				}
			} )
	}

	const unapproveComment = () => {
		comments
			.comments()
			.update( id, 'unapprove', item )
			.then( response => {
				if ( '0' == response.data.commentData.comment_approved ) {
					set_approveStatus( false )
					set_actionApprove( false )
					set_responseMessage( {
						message: 'Comment Un-Approved!',
						status: 'destructive',
						icon: Icon.Reject
					} )
					item.approved = false
					setCurrentHistoryState( { item } )

				}
			} )
	}


	const spamComment = () => {
		comments
			.comments()
			.update( id, 'spam', item )
			.then( () => {
				set_responseMessage( {
					message: 'Comment has been marked as spam!',
					status: 'destructive',
					icon: Icon.Spam
				} )
				set_spamStatus( true )
				set_actionSpam( true )
				item.spam = true
				setCurrentHistoryState( { item } )
			} )
	}

	const UnspamComment = () => {
		comments
			.comments()
			.update( id, 'unspam', item )
			.then( () => {
				set_responseMessage( {
					message: 'Comment has been restored from spam!',
					status: 'alert',
					icon: Icon.Unspam
				} )
				set_spamStatus( false )
				set_actionSpam( false )
				item.spam = false
				setCurrentHistoryState( { item } )
			} )
	}


	const trashComment = () => {
		comments
			.comments()
			.update( id, 'trash', item )
			.then( response => {
				if ( 'trash' == response.data.commentData.comment_approved ) {
					set_responseMessage( {
						message: 'Comment has been moved to trashed!',
						status: 'destructive',
						icon: Icon.Trash
					} )
					set_trashStatus( true )
					set_actionTrash( true )
					item.trash = true
					setCurrentHistoryState( { item } )
				}
			} )
	}

	const untrashComment = () => {
		comments
			.comments()
			.update( id, 'untrash', item )
			.then( () => {
				set_responseMessage( {
					message: 'Comment has been Restored!',
					status: 'primary',
					icon: Icon.Restore
				} )
				set_trashStatus( false )
				set_actionTrash( false )
				item.trash = false
				setCurrentHistoryState( { item } )
			} )
	}

	const ReplyComment = () => {
		set_commentStatus( 'reply' )
	}


	return (

		[
			{ label: 'View on Post', href: url },
			{ label: 'View on Admin', href: editUrl },
			{ label: actionApprove ? 'Reject' : 'Approve', onClick: actionApprove ? unapproveComment : approveComment },
			{ label: actionSpam ? 'UnSpam' : 'Mark as Spam', onClick: actionSpam ? UnspamComment : spamComment },
			{ label: 'Reply', onClick: ReplyComment },
			{ label: actionTrash ? 'Restore' : 'Trash Comment', onClick: actionTrash ? untrashComment : trashComment, status: 'destructive' },

		] )
}
