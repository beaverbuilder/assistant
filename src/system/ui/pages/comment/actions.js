import React, { useState } from 'react'
import { getWpRest } from 'utils/wordpress'
import { Icon } from 'ui'
import { getSystemActions } from 'data'

export const getCommentActions = ( {
	setApproveStatus, setResponseMessage, setSpamStatus, setTrashStatus, setCommentStatus,
	approveStatus, spamStatus, trashStatus, commentStatus, item } ) => {

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
	const [ actionApprove, setActionApprove ] = useState( approved )
	const [ actionSpam, setActionSpam ] = useState( spam )
	const [ actionTrash, setActionTrash ] = useState( trash )


	const approveComment = () => {
		comments
			.comments()
			.update( id, 'approve', item )
			.then( response => {
				if ( '1' == response.data.commentData.comment_approved ) {
					setResponseMessage( {
						message: 'Comment Approved!',
						status: 'alert',
						icon: Icon.Approve
					} )
					setApproveStatus( true )
					item.approved = true
					set_actionApprove( true )
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
					setApproveStatus( false )
					setActionApprove( false )
					setResponseMessage( {
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
				setResponseMessage( {
					message: 'Comment has been marked as spam!',
					status: 'destructive',
					icon: Icon.Spam
				} )
				setSpamStatus( true )
				setActionSpam( true )
				item.spam = true
				setCurrentHistoryState( { item } )
			} )
	}

	const UnspamComment = () => {
		comments
			.comments()
			.update( id, 'unspam', item )
			.then( () => {
				setResponseMessage( {
					message: 'Comment has been restored from spam!',
					status: 'alert',
					icon: Icon.Unspam
				} )
				setSpamStatus( false )
				setActionSpam( false )
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
					setResponseMessage( {
						message: 'Comment has been moved to trashed!',
						status: 'destructive',
						icon: Icon.Trash
					} )
					setTrashStatus( true )
					setActionTrash( true )
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
				setResponseMessage( {
					message: 'Comment has been Restored!',
					status: 'primary',
					icon: Icon.Restore
				} )
				setTrashStatus( false )
				setActionTrash( false )
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
			{ label: actionApprove ? 'Reject' : 'Approve', onClick: approved ? unapproveComment : approveComment },
			{ label: actionSpam ? 'UnSpam' : 'Mark as Spam', onClick: actionSpam ? UnspamComment : spamComment },
			{ label: 'Reply', onClick: ReplyComment },
			{ label: actionTrash ? 'Restore Comment' : 'Trash Comment', onClick: actionTrash ? untrashComment : trashComment, status: 'destructive' },

		] )
}
