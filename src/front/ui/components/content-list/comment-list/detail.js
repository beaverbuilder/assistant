import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import striptags from 'striptags'
import { getSystemActions } from 'store'
import { updateComment, replyToComment } from 'utils/wordpress'
import {
	Button,
	ContentFrame,
	ContentItem,
	ContentListDetail,
	Icon,
	ScreenHeader,
	Separator,
	SettingsGroup,
	SettingsItem,
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
		const message = __( 'Do you really want to trash this item?' )
		if ( confirm( message ) ) {
			updateComment( id, 'trash' )
			decrementCount( 'notifications/comments' )
			removeItem()
			popView()
		}
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

				<SettingsGroup>
					<SettingsItem label='Email'>
						{ authorEmail }
					</SettingsItem>
					<SettingsItem label='IP Address'>
						{ authorIP }
					</SettingsItem>
					<SettingsItem label='Submitted On'>
						{ date }
					</SettingsItem>
				</SettingsGroup>

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

	const title = (
		<Fragment>
			<strong>{ author }</strong> commented
		</Fragment>
	)

	const meta = (
		<Fragment>
			In response to <strong>{ postTitle }</strong>
		</Fragment>
	)

	return (
		<ContentItem
			thumbnail={ thumbnail }
			title={ title }
			meta={ meta }
		/>
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
