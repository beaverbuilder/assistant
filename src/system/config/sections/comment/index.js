import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form } from 'lib'
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
