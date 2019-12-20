import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Form, Icon } from 'ui'
import { Page, Button } from 'fluid/ui'
import { getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'


export const Comment = ( { location } ) => {
	const { item } = location.state
	const {id, approved, author, date, authorEmail, authorIP, content, trash, spam} = item
	const { pluginURL } = getSystemConfig()
	const hero = `${pluginURL}img/comment-hero-a.jpg`
	const comments = getWpRest()

	const [ responseMessage, set_responseMessage ] = React.useState( {
		message: '',
		status: ''
	} )
	const [ commentStatus, set_commentStatus ] = React.useState( approved )
	const [ approveStatus, set_approveStatus ] = React.useState( approved )
	const [ trashStatus, set_trashStatus ] = React.useState( trash )
	const [ spamStatus, set_spamStatus ] = React.useState( spam )
	const [ editContent, setEditContent ] = React.useState( content )

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
						options: [ { label: 'Test' }, { label: 'Test Again' } ]
					}
				}
			}
		},
		defaults: item
	} )

	const approveComment = () => {
		comments
			.comments()
			.update( id, 'approve', item )
			.then( response => {
				if ( '1' == response.data.commentData.comment_approved ) {
					set_responseMessage( {
						message: 'Comment Approved!',
						status: 'alert'
					} )
					set_approveStatus( true )

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
						status: 'destructive'
					} )
					set_approveStatus( false )

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
					status: 'destructive'
				} )
				set_spamStatus( true )

			} )
	}

	const UnspamComment = () => {
		comments
			.comments()
			.update( id, 'unspam', item )
			.then( () => {
				set_responseMessage( {
					message: 'Comment has been restored from spam!',
					status: 'alert'
				} )
				set_spamStatus( false )

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
						status: 'destructive'
					} )
					set_trashStatus( true )

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
					status: 'primary'
				} )
				set_trashStatus( false )

			} )
	}

	const editComment = () => {
		set_commentStatus( 'edit' )
	}

	const updateContent = () => {
		comments
			.comments()
			.update( id, 'content', { content: editContent } )
			.then( () => {
				set_responseMessage( {
					message: 'Comment has been updated!',
					status: 'primary'
				} )
				set_commentStatus( 'update' )

			} )
	}

	return (
		<Page title={ __( 'Edit Comment' ) } hero={ hero }>
			<Page.Headline>{author}</Page.Headline>
			<div>{sprintf( 'commented on %s', date )}</div>

			{'edit' !== commentStatus && (
				<div
					className='fl-asst-content-area'
					dangerouslySetInnerHTML={ { __html: editContent } }
				/>
			)}
			{'edit' == commentStatus && (
				<textarea
					value={ editContent }
					onChange={ e => setEditContent( e.target.value ) }
					rows={ 2 }
				/>
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
					(
					<Button
						appearance='elevator'
						status='primary'
						title='Approve'
						onClick={ approveComment }
					>
						<Icon.Approve />
					</Button>
				)}

				{true === approveStatus && false === spamStatus && (
					<Button
						appearance='elevator'
						status='alert'
						title='Reject'
						onClick={ unapproveComment }
					>
						<Icon.Reject />
					</Button>
				)}
				{false === trashStatus && false === spamStatus && (
					<Button appearance='elevator' title='Reply'>
						<Icon.Reply />
					</Button>
				)}
				{'edit' !== commentStatus && false === spamStatus && (
					<Button appearance='elevator' title='Edit' onClick={ editComment }>
						<Icon.Edit />
					</Button>
				)}
				{'edit' == commentStatus && (
					<Button appearance='elevator' title='Save' onClick={ updateContent }>
						Save
					</Button>
				)}

				{false === spamStatus && (
					<Button
						appearance='elevator'
						status='alert'
						title='Spam'
						onClick={ spamComment }
					>
						<Icon.Spam />
					</Button>
				)}
				{true === spamStatus && (
					<Button
						appearance='elevator'
						status='alert'
						title='Unspam'
						onClick={ UnspamComment }
					>
						<Icon.Unspam />
					</Button>
				)}
				{false === trashStatus && (
					<Button
						appearance='elevator'
						status='destructive'
						title='Trash'
						onClick={ trashComment }
					>
						<Icon.Trash />
					</Button>
				)}
				{true === trashStatus && (
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
				<Button status={ responseMessage.status }>
					{responseMessage.message}
				</Button>
			)}

			{renderForm()}
		</Page>
	)
}
