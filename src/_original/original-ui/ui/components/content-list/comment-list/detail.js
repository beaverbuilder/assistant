import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { autop } from '@wordpress/autop'
import { __ } from '@wordpress/i18n'
import striptags from 'striptags'
import { getSystemActions } from 'data'
import { updateComment, replyToComment } from 'shared-utils/wordpress'
import {
	Button,
	Form,
	Heading,
	ContentFrame,
	ContentItem,
	ContentListDetail,
	Icon,
	Separator,
	TagGroup,
	Tag,
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
	const { dismiss } = useContext( StackContext )
	const {
		approved,
		authorEmail,
		authorIP,
		content,
		date,
		id,
		postId,
		spam,
		time,
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
		dismiss()
	}

	const trashClicked = () => {
		const message = __( 'Do you really want to trash this item?' )
		if ( confirm( message ) ) {
			updateComment( id, 'trash' )
			decrementCount( 'comment/total' )
			removeItem()
			dismiss()
		}
	}

	const restoreClicked = () => {
		updateComment( id, 'untrash' )
		incrementCount( 'comment/total' )
		removeItem()
		dismiss()
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

			<form>
				<Form.Item>
					<CommentDetailTitle />
				</Form.Item>

				<Form.Section label={ __( 'Sender Information' ) } isInset={ true }>
					<Form.Item label='Email' placement="beside">
						<a href={ `mailto:${ authorEmail }` }>{ authorEmail }</a>
					</Form.Item>
					<Form.Item label='IP Address' placement="beside">
						{ authorIP }
					</Form.Item>
					<Form.Item label='Submitted On' placement="beside">
						{ date } at { time }
					</Form.Item>
				</Form.Section>

				<Form.Item style={ { paddingTop: 5 } }>
					<TagGroup appearance='muted' className='fl-asst-comment-actions'>
						{ ! spam && ! trash &&
							<Fragment>
								<Tag onClick={ approveClicked }>{ approved ? 'Unapprove' : 'Approve' }</Tag>
								<Tag href={ url }>View</Tag>
							</Fragment>
						}
						<Tag onClick={ spamClicked }>{ spam ? 'Not Spam' : 'Spam' }</Tag>
						{ ! trash && <Tag onClick={ trashClicked } appearance='warning'>Trash</Tag> }
						{ trash && <Tag onClick={ restoreClicked }>Restore</Tag> }
					</TagGroup>
				</Form.Item>

				<Form.Section>
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
						<div style={ { padding: '0 var(--fl-asst-base-padding)' } }>
							<ContentFrame>
								<Heading style={ { display: 'flex', flexDirection: 'row' } }>{contentTitle}</Heading>
								<div dangerouslySetInnerHTML={ { __html: autop( content ) } } />
							</ContentFrame>
						</div>
					}
				</Form.Section>

			</form>
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
			<span className='fl-asst-comment-content-title'>{__( 'Comment' )}</span>
			{ ! editing && ! replying &&
				<div style={ { marginLeft: 'auto' } }>
					<Button onClick={ () => setReplying( true ) }>{__( 'Reply' )}</Button>
					<Button onClick={ () => setEditing( true ) }>{__( 'Edit' )}</Button>
				</div>
			}
		</Fragment>
	)
}

const CommentReplyForm = ( { sendingReply, onSave, onCancel } ) => {
	const [ reply, setReply ] = useState( '' )
	const { approved } = useContext( ViewContext )
	return (
		<Fragment>
			<Form.Item label={ __( 'Reply to Comment' ) } className='fl-asst-comment-form'>
				<textarea value={ reply } onChange={ e => setReply( e.target.value ) } rows={ 6 } />
			</Form.Item>
			<Form.Item>
				{ sendingReply &&
				<Button>{__( 'Replying' )} &nbsp;<Icon name='small-spinner' /></Button>
				}
				{ ! sendingReply &&
				<Fragment>
					<Button onClick={ () => onSave( reply ) }>{ approved ? 'Reply' : 'Reply & Approve' }</Button>
					<Button onClick={ () => onCancel() }>Cancel</Button>
				</Fragment>
				}
			</Form.Item>
		</Fragment>
	)
}

const CommentEditForm = ( { content, onSave, onCancel } ) => {
	const [ comment, setComment ] = useState( content )
	return (
		<Fragment>
			<Form.Item label={ __( 'Edit Comment' ) } className='fl-asst-comment-form'>
				<textarea value={ comment } onChange={ e => setComment( e.target.value ) } rows={ 15 }/>
			</Form.Item>
			<Form.Item>
				<Button onClick={ () => onSave( comment ) }>Save</Button>
				<Button onClick={ () => onCancel() }>Cancel</Button>
			</Form.Item>
		</Fragment>
	)
}
