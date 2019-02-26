import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import striptags from 'striptags'
import { getSystemActions } from 'store'
import { updateComment, replyToComment } from 'utils/wordpress'
import {
	Button,
	ContentFrame,
	ContentListDetail,
	FormField,
	Icon,
	ScreenHeader,
	Separator,
	TagGroup,
	Tag,
	Widget,
	UIContext,
	StackContext,
	ViewContext,
} from 'components'

export const CommentDetail = () => {
	const mounted = useRef( false )
	const [ editing, setEditing ] = useState( false )
	const [ replying, setReplying ] = useState( false )
	const [ sendingReply, setSendingReply ] = useState( false )
	const { incrementCount, decrementCount } = getSystemActions()
	const { presentNotification } = useContext( UIContext )
	const { popView } = useContext( StackContext )
	const {
		approved,
		authorEmail,
		authorIP,
		content,
		date,
		id,
		postId,
		spam,
		trash,
		url,
		updateItem,
		removeItem
	} = useContext( ViewContext )

	useEffect( () => {
		mounted.current = true
		return () => mounted.current = false
	} )

	const approveClicked = () => {
		updateComment( id, approved ? 'unapprove' : 'approve' )
		updateItem( { approved: ! approved } )
	}

	const spamClicked = () => {
		updateComment( id, spam ? 'unspam' : 'spam' )
		removeItem()
		popView()
	}

	const trashClicked = () => {
		updateComment( id, 'trash' )
		decrementCount( 'notifications/comments' )
		removeItem()
		popView()
	}

	const restoreClicked = () => {
		updateComment( id, 'untrash' )
		incrementCount( 'notifications/comments' )
		removeItem()
		popView()
	}

	const onEditSave = value => {
		setEditing( false )
		updateComment( id, 'content', { content: value } )
		presentNotification( 'Comment updated!' )
		updateItem( {
			content: value,
			title: striptags( value ),
		} )
	}

	const onReplySave = value => {
		setSendingReply( true )
		replyToComment( id, postId, value, () => {
			presentNotification( 'Comment reply successfully posted!' )
			updateItem( { approved: true } )
			if ( mounted.current ) {
				setSendingReply( false )
				setReplying( false )
			}
		}, () => {
			presentNotification( 'Error! Comment reply not posted.', { appearance: 'error' } )
			if ( mounted.current ) {
				setSendingReply( false )
			}
		} )
	}

	const detailTitle = (
		<CommentDetailTitle />
	)

	const contentTitle = (
		<CommentContentTitle
			editing={ editing }
			replying={ replying }
			setEditing={ setEditing }
			setReplying={ setReplying }
		/>
	)

	return (
		<ContentListDetail className='fl-asst-comment-detail'>

			<ScreenHeader title={ detailTitle }>

				<div className='fl-asst-comment-meta'>
					<FormField label='Email' labelPosition='beside'>
						{ authorEmail }
					</FormField>
					<FormField label='IP Address' labelPosition='beside'>
						{ authorIP }
					</FormField>
					<FormField label='Submitted On' labelPosition='beside'>
						{ date }
					</FormField>
				</div>

				<TagGroup appearance='muted' className='fl-asst-comment-actions'>
					{ ! spam && ! trash &&
						<Fragment>
							<Tag onClick={ approveClicked }>{ approved ? 'Unapprove' : 'Approve' }</Tag>
							<Tag href={url}>View</Tag>
						</Fragment>
					}
					<Tag onClick={ spamClicked }>{ spam ? 'Not Spam' : 'Spam' }</Tag>
					{ ! trash && <Tag onClick={ trashClicked } appearance='warning'>Trash</Tag> }
					{ trash && <Tag onClick={ restoreClicked }>Restore</Tag> }
				</TagGroup>

			</ScreenHeader>

			{ replying &&
				<Fragment>
					<CommentReplyForm
						sendingReply={ sendingReply }
						onSave={ onReplySave }
						onCancel ={ () => setReplying( false ) }
					/>
					<Separator />
				</Fragment>
			}

			{ editing &&
				<CommentEditForm
					content={ content }
					onSave={ onEditSave }
					onCancel ={ () => setEditing( false ) }
				/>
			}

			{ ! editing &&
				<Widget title={ contentTitle } className='fl-asst-comment-content'>
					<ContentFrame dangerouslySetInnerHTML={ { __html: content } } />
				</Widget>
			}
		</ContentListDetail>
	)
}

const CommentDetailTitle = () => {
	const { author, postTitle, thumbnail } = useContext( ViewContext )
	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}
	return (
		<div className='fl-asst-comment-title'>
			<div className='fl-asst-comment-title-visual'>
				<div className='fl-asst-comment-title-visual-box' style={ thumbStyles }></div>
			</div>
			<div className='fl-asst-comment-title-meta'>
				<div className='fl-asst-comment-title-author'>
					<strong>{ author }</strong> commented
				</div>
				<div className='fl-asst-comment-title-post'>
					In response to <strong>{ postTitle }</strong>
				</div>
			</div>
		</div>
	)
}

const CommentContentTitle = ( { editing, replying, setEditing, setReplying } ) => {
	return (
		<Fragment>
			<div className='fl-asst-comment-content-title'>Comment</div>
			{ ! editing && ! replying &&
				<TagGroup className='fl-asst-comment-content-actions'>
					<Tag onClick={ () => setReplying( true ) }>Reply</Tag>
					<Tag onClick={ () => setEditing( true ) }>Edit</Tag>
				</TagGroup>
			}
		</Fragment>
	)
}

const CommentReplyForm = ( { sendingReply, onSave, onCancel } ) => {
	const [ reply, setReply ] = useState( '' )
	const { approved } = useContext( ViewContext )
	return (
		<Widget title='Reply to Comment' className='fl-asst-comment-form'>
			<textarea value={ reply } onChange={ e => setReply( e.target.value ) } />
			{ sendingReply &&
				<Button>Replying &nbsp;<Icon name='small-spinner' /></Button>
			}
			{ ! sendingReply &&
				<Fragment>
					<Button onClick={ () => onSave( reply ) }>{ approved ? 'Reply' : 'Reply & Approve' }</Button>
					<Button onClick={ () => onCancel() }>Cancel</Button>
				</Fragment>
			}
		</Widget>
	)
}

const CommentEditForm = ( { content, onSave, onCancel } ) => {
	const [ comment, setComment ] = useState( content )
	return (
		<Widget title='Edit Comment' className='fl-asst-comment-form'>
			<textarea value={ comment } onChange={ e => setComment( e.target.value ) } />
			<Button onClick={ () => onSave( comment ) }>Save</Button>
			<Button onClick={ () => onCancel() }>Cancel</Button>
		</Widget>
	)
}
