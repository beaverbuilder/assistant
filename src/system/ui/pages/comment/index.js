import React, { useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Form, Icon, Button, Page, Layout } from 'ui'
import { getSystemConfig, getSystemActions } from 'data'
import { getWpRest, replyToComment } from 'utils/wordpress'


export const Comment = ( { location } ) => {
	const { item } = location.state
	const {
		id,
		approved,
		author,
		date,
		content,
		trash,
		spam,
		postId,
		url,
		editUrl,
		authorUrl,
	} = item
	const { pluginURL } = getSystemConfig()
	const hero = `${pluginURL}img/comment-hero-a.jpg`
	const comments = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()

	const [ responseMessage, setResponseMessage ] = useState( {
		message: '',
		status: '',
		icon: ''
	} )
	const [ commentStatus, setCommentStatus ] = useState( approved )
	const [ approveStatus, setApproveStatus ] = useState( approved )
	const [ trashStatus, setTrashStatus ] = useState( trash )
	const [ spamStatus, setSpamStatus ] = useState( spam )
	const [ editContent, setEditContent ] = useState( content )
	const [ replyValue, setreplyValue ] = useState( '' )


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
					setResponseMessage( {
						message: 'Comment Un-Approved!',
						status: 'destructive',
						icon: Icon.Reject
					} )
					setApproveStatus( false )
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
					status: 'alert',
					icon: Icon.Spam
				} )
				setSpamStatus( true )
				item.spam = true
				setCurrentHistoryState( { item } )
			} )
	}

	const unspamComment = () => {
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
					message: 'Comment has been restored!',
					status: 'primary',
					icon: Icon.Restore
				} )
				setTrashStatus( false )
				item.trash = false
				setCurrentHistoryState( { item } )
			} )
	}

	const editComment = () => {
		setCommentStatus( 'edit' )
	}

	const updateContent = () => {
		if ( '' === editContent ) {
			alert( 'Please type a comment!' )
		} else {
			comments
				.comments()
				.update( id, 'content', { content: editContent } )
				.then( () => {
					setResponseMessage( {
						message: 'Comment has been updated!',
						status: 'primary',
						icon: Icon.Update
					} )
					item.content = editContent
					setCurrentHistoryState( { item } )
					setCommentStatus( 'update' )

				} )
		}
	}

	const resetEdit = () => {
		setCommentStatus( 'cancelEdit' )
		setEditContent( content )
	}

	const UpdateCommentBtn = () => {
		return (
			<div className='cmt-btn-wrap'>
				<Button className='cmt-cncl-btn' onClick={ resetEdit }>
					{__( 'Cancel' )}
				</Button>
				<div style={ { flex: '1 1 auto', margin: 'auto' } } />
				<Button
					className='fl-asst-cmt-updt-btn'
					type='submit'
					status='primary'
					onClick={ updateContent }
				>
					{__( 'Save' )}
				</Button>
			</div>
		)
	}

	const replyComment = () => {
		setCommentStatus( 'reply' )
	}

	const replyCommentpost = () => {
		if ( '' === replyValue ) {
			alert( 'Please type a comment!' )
		} else {
			const Rc = replyToComment( id, postId, replyValue, () => { } )
			Rc.then( () => {
				setCommentStatus( 'cancelReply' )
				setResponseMessage( {
					message: 'Reply Successfully posted!',
					status: 'primary',
					icon: Icon.Reply
				} )
			} )
		}
	}

	const resetReply = () => {
		setCommentStatus( 'cancelReply' )
	}

	const ReplyCommentBtn = () => {
		return (
			<div className='cmt-btn-wrap'>
				<Button className='fl-asst-cmt-cncl-btn' onClick={ resetReply }>
					{__( 'Cancel' )}
				</Button>
				<div style={ { flex: '1 1 auto', margin: 'auto' } } />
				<Button
					className='fl-asst-cmt-updt-btn'
					type='submit'
					status='primary'
					onClick={ replyCommentpost }
				>
					{__( 'Reply' )}
				</Button>
			</div>
		)
	}

	const { renderForm } = Form.useForm( {
		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					authorEmail: {
						label: __( 'Email Address' ),
						labelPlacement: 'beside',
						type: 'text',
						component: 'plain-text'
					},
					authorIP: {
						label: __( 'IP Address' ),
						labelPlacement: 'beside',
						type: 'text',
						component: 'plain-text'
					},
					authorUrl: {
						label: __( 'Author Url' ),
						component: 'url'
					},
					date: {
						label: __( 'Submitted On' ),
						labelPlacement: 'beside',
						type: 'text',
						component: 'plain-text'
					}
				}
			},
			actions: {
				label: __( 'Actions' ),
				fields: {
					actions: {
						component: 'actions',
						options: [
							{ label: 'View on Post', href: url, disabled: trashStatus ? true : false },
							{ label: 'View in Admin', href: editUrl },
							{ label: approveStatus ? 'Unapprove' : 'Approve', onClick: approveStatus ? unapproveComment : approveComment, disabled: ( trashStatus ? true : false ) || ( spamStatus ? true : false ) },
							{ label: 'Mark as Spam', onClick: spamComment, disabled: ( trashStatus ? true : false ) || ( spamStatus ? true : false ) },
							{ label: 'Reply', onClick: replyComment, disabled: ( trashStatus ? true : false ) || ( 'reply' === commentStatus ? true : false ) },
							{ label: trashStatus ? 'Restore Comment' : 'Trash Comment', onClick: trashStatus ? untrashComment : trashComment, status: trashStatus ? 'primary' : 'destructive' },
						]
					}
				}
			}
		},
		defaults: item
	} )

	return (
		<Page title={ __( 'Edit Comment' ) } hero={ hero }>

			<Layout.Headline>{author}</Layout.Headline>
			<div>{sprintf( 'commented on %s', date )}</div>

			{'edit' !== commentStatus && (
				<div
					className='fl-asst-content-area'
					dangerouslySetInnerHTML={ { __html: item.content } }
				/>
			)}
			{'edit' == commentStatus && (
				<div className='fl-asst-cmt-text-wrap'>
					<span className="edit-comment-title">Edit Comment</span>
					<textarea
						className="fl-asst-comment-text"
						value={ editContent }
						onChange={ e => setEditContent( e.target.value ) }
						rows={ 6 }
					/>
					<UpdateCommentBtn />
				</div>
			)}
			{'reply' == commentStatus && (
				<div className='fl-asst-cmt-text-wrap'>
					<span className="fl-asst-edit-comment-title">Reply Comment</span>
					<textarea
						className="fl-asst-comment-text"
						value={ replyValue }
						onChange={ e => setreplyValue( e.target.value ) }
						rows={ 6 }
					/>
					<ReplyCommentBtn />
				</div>
			)}
			<div
				style={ {
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					flex: '0 0 auto',
					margin: '10px 0 20px'
				} }
			>
				{false === trashStatus &&
					false === spamStatus &&
					false == approveStatus &&
					( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button
						appearance='elevator'
						status='primary'
						title='Approve'
						onClick={ approveComment }
					>
						<Icon.Approve />
					</Button>
				)}

				{true === approveStatus && false === spamStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button
						appearance='elevator'
						status='alert'
						title='Reject'
						onClick={ unapproveComment }
					>
						<Icon.Reject />
					</Button>
				)}
				{false === trashStatus && false === spamStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button appearance='elevator' title='Reply' onClick={ replyComment }>
						<Icon.Reply />
					</Button>
				)}


				{false === spamStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button
						appearance='elevator'
						status='alert'
						title='Spam'
						onClick={ spamComment }
					>
						<Icon.Spam />
					</Button>
				)}
				{true === spamStatus && false === trashStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button
						appearance='elevator'
						status='primary'
						title='Unspam'
						onClick={ unspamComment }
					>
						<Icon.Unspam />
					</Button>
				)}

				{'edit' !== commentStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button appearance='elevator' title='Edit' onClick={ editComment }>
						<Icon.Edit />
					</Button>
				)}
				{false === trashStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button
						appearance='elevator'
						status='destructive'
						title='Trash'
						onClick={ trashComment }
					>
						<Icon.Trash />
					</Button>
				)}
				{true === trashStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button
						appearance='elevator'
						status='primary'
						title='UnTrash'
						onClick={ untrashComment }
					>
						<Icon.Restore />
					</Button>
				)}
			</div>

			{responseMessage.message && (
				<Layout.Message status={ responseMessage.status } icon={ responseMessage.icon }>
					{responseMessage.message}
				</Layout.Message>
			)}

			{renderForm()}
		</Page>
	)
}
