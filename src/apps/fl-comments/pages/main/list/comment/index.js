import React, { useState, useEffect, useRef } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { motion } from 'framer-motion'
import LimitContent from '../limit-content'
import { Layout, Button, Icon } from 'assistant/ui'
import { replyToComment } from 'assistant/utils/wordpress'
import Actions from '../item-actions'
import './style.scss'

const Gutter = ( { isPending = false, isSpam = false, isTrash = false } ) => {
	return (
		<div className="fl-asst-comment-gutter">
			<div className="fl-asst-thread-line" />

			<div className="fl-asst-gutter-dot-area">
				<div className={ classname( {
					'fl-asst-dot': true,
					'is-pending': isPending,
					'is-spam': isSpam,
					'is-trash': isTrash
				} ) } />
			</div>

		</div>
	)
}

const Author = ( { name, avatar, date } ) => {
	return (
		<div className="fl-asst-comment-header">
			<div className="fl-asst-comment-avatar">
				<Layout.AspectBox
					style={ {
						width: 30,
						backgroundImage: `url(${ avatar })`,
						backgroundSize: 'cover'
					} }
				/>
			</div>
			<div className="fl-asst-comment-author-name">
				{name}
				{ date && <span className="fl-asst-comment-since">{date}</span> }
			</div>
		</div>
	)
}

const Meta = ( { url, ip, email } ) => {
	const stopProp = e => e.stopPropagation()
	return (
		<div className="fl-asst-comment-meta">
			{ url && (
				<span className="fl-asst-comment-meta-value">
					<strong>{__( 'URL' )}&nbsp;</strong>
					<a href={ url } target="_blank" rel="noopener noreferrer" onClick={ stopProp }>{url}</a>
				</span>
			) }
			{ ip && (
				<span className="fl-asst-comment-meta-value">
					<strong>{__( 'IP Address' )}&nbsp;</strong>
					<span>{ip}</span>
				</span>
			) }
			{ email && (
				<span className="fl-asst-comment-meta-value">
					<strong>{__( 'Email' )}&nbsp;</strong>
					<a href={ `mailto:${email}` } onClick={ stopProp }>{email}</a>
				</span>
			) }
		</div>
	)
}

const Reply = ({
	onDismiss,
	id,
	postID
}) => {
	const ref = useRef()
	const [replyWasPosted, setReplyWasPosted] = useState( false )

	const stop = e => {
		e.stopPropagation()
		e.preventDefault()
	}
	const dismiss = e => {
		onDismiss()
		stop( e )
	}
	const reply = e => {

		if ( '' !== ref.current.value ) {
			replyToComment( id, postID, ref.current.value, () => { } ).then( response => {
				console.log('success???', response )
				setReplyWasPosted( true )
			} )
		}
		stop( e )
	}

	// Set focus on mount
	useEffect( () => {
		ref.current && ref.current.focus()
	}, [])

	if ( replyWasPosted ) {
		return (
			<Layout.Row
				padY={true}
				style={{
					background: 'var(--fluid-primary-background)',
					color: 'var(--fluid-primary-color)',
					borderRadius: 'var(--fluid-radius)',
					marginTop: 10
				}}
			>{__('Success! Your reply was posted.')}</Layout.Row>
		)
	}

	return (
		<motion.div
			style={{ padding: '20px 0 5px'}}
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
		>
			<textarea
				ref={ref}
				onClick={stop}
				placeholder={__('Type Your Reply...')}
				style={{
					maxWidth: '100%',
					minHeight: 100,
					resize: 'none'
				}}
			/>
			<Layout.Row style={{ padding: '5px 0' }}>
				<Button
					onClick={ dismiss }
				>
					{__('Cancel')}
				</Button>
				<Button
					status="primary"
					onClick={ reply }
					style={{ marginLeft: 'auto' }}
				>
					{__('Reply')}
				</Button>
			</Layout.Row>
		</motion.div>
	)
}

export default ( {
	id,
	content,
	isPending,
	isSpam,
	isTrash,
	author,
	post,
	to,
	className,
	actions: initialActions,
	approveComment,
	unapproveComment,
	spamComment,
	unspamComment,
	trashComment,
	restoreComment,
} ) => {
	const [actions, setActions] = useState( initialActions )
	const [isReplying, setIsReplying] = useState( false )
	const toggleReplying = () => setIsReplying( ! isReplying )

	useEffect( () => {
		const additional = [
			{
				handle: 'reply',
				title: __( 'Reply' ),
				icon: <Icon.Reply />,
				onClick: toggleReplying
			},
			{
				handle: 'approve',
				onClick: isPending ? approveComment : unapproveComment,
				title: isPending ? __( 'Approve' ) : __( 'Reject' ),
				icon: isPending ? <Icon.Approve /> : <Icon.Reject />
			},
			{
				handle: 'spam',
				onClick: ! isSpam ? spamComment : unspamComment,
				title: ! isSpam ? __( 'Mark as Spam' ) : __( 'Unmark as Spam' ),
				icon: ! isSpam ? <Icon.Spam /> : <Icon.Unspam />
			},
			{
				handle: 'trash',
				status: 'destructive',
				onClick: ! isTrash ? trashComment : restoreComment,
				title: ! isTrash ? __( 'Move to trash' ) : __( 'Restore' ),
				icon: ! isTrash ? <Icon.Trash /> : <Icon.Restore />
			}
		]
		setActions( [ ...actions, ...additional ] )
	}, [])

	return (
		<motion.li
			className={ classname( {
				'is-spam': isSpam,
				'is-pending': isPending,
				'is-trash': isTrash,
			}, className ) }
			initial={ { scale: .5 } }
			animate={ { scale: 1 } }
		>
			<Button to={ to } style={ { display: 'flex', flexDirection: 'row', padding: 0 } }>
				<Gutter
					isPending={ isPending }
					isSpam={ isSpam }
					isTrash={ isTrash }
				/>
				<div className="fl-asst-comment-cell">

					<Author { ...author } />

					{ isPending && ! isSpam && ! isTrash && <Meta { ...author } /> }

					<LimitContent>
						<div className="fl-asst-comment-content"
							dangerouslySetInnerHTML={ { __html: content } }
						/>
					</LimitContent>

					{ isReplying && (
						<Reply
							id={id}
							postID={post.id}
							onDismiss={ () => setIsReplying( false ) }
						/>
					) }
				</div>
			</Button>
			<Actions items={actions} />
		</motion.li>
	)
}
