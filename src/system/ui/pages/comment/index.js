import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Form, Icon, Message } from 'ui'
import { Button, Page } from 'fluid/ui'
import { getSystemConfig, getSystemActions } from 'data'
import { getWpRest, replyToComment } from 'utils/wordpress'
import { getCommentActions } from './actions'


export const Comment = ( { location } ) => {
	const { item } = location.state
	const {
		id,
		approved,
		author,
		date,
		authorEmail,
		authorIP,
		content,
		trash,
		spam,
		postId
	} = item
	const { pluginURL } = getSystemConfig()
	const hero = `${pluginURL}img/comment-hero-a.jpg`
	const comments = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()

	const [ responseMessage, set_responseMessage ] = React.useState( {
		message: '',
		status: '',
		icon: ''
	} )
	const [ commentStatus, set_commentStatus ] = React.useState( approved )
	const [ approveStatus, set_approveStatus ] = React.useState( approved )
	const [ trashStatus, set_trashStatus ] = React.useState( trash )
	const [ spamStatus, set_spamStatus ] = React.useState( spam )
	const [ editContent, setEditContent ] = React.useState( content )
	const [ replyValue, setreplyValue ] = React.useState( '' )

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
					set_responseMessage( {
						message: 'Comment Un-Approved!',
						status: 'destructive',
						icon: Icon.Reject
					} )
					set_approveStatus( false )
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
				item.trash = false
				setCurrentHistoryState( { item } )
			} )
	}

	const editComment = () => {
		set_commentStatus( 'edit' )
	}

	const updateContent = () => {
		if ( '' === editContent ) {
			alert( 'Please type a comment!' )
		} else {
			comments
				.comments()
				.update( id, 'content', { content: editContent } )
				.then( () => {
					set_responseMessage( {
						message: 'Comment has been updated!',
						status: 'primary',
						icon: Icon.Update
					} )
					item.content = editContent
					setCurrentHistoryState( { item } )
					set_commentStatus( 'update' )

				} )
		}
	}

	const resetEdit = () => {
		set_commentStatus( 'cancelEdit' )
		setEditContent( content )
	}

	const UpdateCommentBtn = () => {
		return (
			<div className='CmtBtnWrap'>
				<Button className='CmtCnclBtn' onClick={ resetEdit }>
					{__( 'Cancel' )}
				</Button>
				<div style={ { flex: '1 1 auto', margin: 'auto' } } />
				<Button
					className='CmtupdtBtn'
					type='submit'
					status='primary'
					onClick={ updateContent }
				>
					{__( 'Save' )}
				</Button>
			</div>
		)
	}

	const ReplyComment = () => {
		set_commentStatus( 'reply' )
	}

	const ReplyCommentpost = () => {
		if ( '' === replyValue ) {
			alert( 'Please type a comment!' )
		} else {
			const Rc = replyToComment( id, postId, replyValue, () => { } )
			Rc.then( () => {
				set_commentStatus( 'cancelReply' )
				set_responseMessage( {
					message: 'Reply Successfully posted!',
					status: 'primary',
					icon: Icon.Reply
				} )
			} )
		}
	}

	const resetReply = () => {
		set_commentStatus( 'cancelReply' )
	}

	const ReplyCommentBtn = () => {
		return (
			<div className='CmtBtnWrap'>
				<Button className='CmtCnclBtn' onClick={ resetReply }>
					{__( 'Cancel' )}
				</Button>
				<div style={ { flex: '1 1 auto', margin: 'auto' } } />
				<Button
					className='CmtupdtBtn'
					type='submit'
					status='primary'
					onClick={ ReplyCommentpost }
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
					email: {
						label: __( 'Email Address' ),
						labelPlacement: 'beside',
						type: 'text',
						value: authorEmail,
						component: 'plain-text'
					},
					IPAddress: {
						label: __( 'IP Address' ),
						labelPlacement: 'beside',
						type: 'text',
						value: authorIP,
						component: 'plain-text'
					},
					date: {
						label: __( 'Submitted On' ),
						labelPlacement: 'beside',
						type: 'text',
						value: date,
						component: 'plain-text'
					}
				}
			},
			actions: {
				label: __( 'Actions' ),
				fields: {
					actions: {
						component: 'actions',
						options: args => getCommentActions( { item,
							set_approveStatus, set_responseMessage, set_spamStatus, set_trashStatus, set_commentStatus, ...args } ),

					}
				}
			}
		},
		defaults: item
	} )

	return (
		<Page title={ __( 'Edit Comment' ) } hero={ hero }>
			<Page.Headline>{author}</Page.Headline>
			<div>{sprintf( 'commented on %s', date )}</div>

			{'edit' !== commentStatus && (
				<div
					className='fl-asst-content-area'
					dangerouslySetInnerHTML={ { __html: item.content } }
				/>
			)}
			{'edit' == commentStatus && (
				<div className='CmtTextWrap'>
					<span className="edit-comment-title">Edit Comment</span>
					<textarea
						className="comment-text"
						value={ editContent }
						onChange={ e => setEditContent( e.target.value ) }
						rows={ 6 }
					/>
					<UpdateCommentBtn />
				</div>
			)}
			{'reply' == commentStatus && (
				<div className='CmtTextWrap'>
					<span className="edit-comment-title">Reply Comment</span>
					<textarea
						className="comment-text"
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
					<Button appearance='elevator' title='Reply' onClick={ ReplyComment }>
						<Icon.Reply />
					</Button>
				)}
				{'edit' !== commentStatus && false === spamStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button appearance='elevator' title='Edit' onClick={ editComment }>
						<Icon.Edit />
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
				{true === spamStatus && ( 'edit' !== commentStatus && 'reply' !== commentStatus ) && (
					<Button
						appearance='elevator'
						status='alert'
						title='Unspam'
						onClick={ UnspamComment }
					>
						<Icon.Unspam />
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
				<Message status={ responseMessage.status } icon={ responseMessage.icon }>
					{responseMessage.message}
				</Message>
			)}

			{renderForm()}
		</Page>
	)
}
