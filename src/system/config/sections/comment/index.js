import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form, Button } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-comment-details', {
	label: __( 'Details' ),
	location: {
		type: 'comment',
	},
	render: ( { comment } ) => {
		const { author, authorIP, authorEmail, date } = comment
		return (
            <>
                <Form.Item label={ __( 'Author' ) } placement="beside">{author}</Form.Item>
                <Form.Item label={ __( 'IP Address' ) } placement="beside">{authorIP}</Form.Item>
                <Form.Item label={ __( 'Email Address' ) } placement="beside">{authorEmail}</Form.Item>
                <Form.Item label={ __( 'Submitted On' ) } placement="beside">{date}</Form.Item>
            </>
		)
	},
} )

registerSection( 'fl-comment-actions', {
	label: __( 'Actions' ),
	location: {
		type: 'comment',
	},
	render: () => {
		return (
			<Form.Item>
				<Button.Group appearance="grid">
					<Button>{__( 'View Post' )}</Button>
					<Button>{__( 'Edit Comment' )}</Button>
					<Button>{__( 'Reply to Comment' )}</Button>
					<Button>{__( 'Approve' )}</Button>
					<Button>{__( 'Mark as Spam' )}</Button>
					<Button>{__( 'Move to Trash' )}</Button>
				</Button.Group>
			</Form.Item>
		)
	},
} )
