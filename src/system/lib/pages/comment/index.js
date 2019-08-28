import React from 'fl-react'
import { __, sprintf } from '@wordpress/i18n'
import { Page, Form, Button, Control } from 'lib'

export const Comment = ( { location = {} } ) => {

	const defaultItem = {
		approved: null,
		author: null,
		authorEmail: null,
		authorIP: null,
		content: null,
		date: null,
		editUrl: null,
		id: null,
		meta: null,
		postId: null,
		postTitle: null,
		spam: false,
		thumbnail: null,
		time: null,
		title: null,
		trash: false,
		url: null,
	}

	const item = 'undefined' !== typeof location.state.item ? { ...defaultItem, ...location.state.item } : defaultItem
	const { content, author, authorIP, date, authorEmail } = item
	const html = { __html: content }

	const Actions = () => {
		return (
			<Control.NextPrev
				onPrev={ () => {} }
				onNext={ () => {} }
			/>
		)
	}

	return (
		<Page title={ __( 'Edit Comment' ) } shouldPadSides={ false } headerActions={ <Actions /> }>

			<Page.TitleCard>
				<h2>{sprintf( '%s Said:', author )}</h2>
				<div dangerouslySetInnerHTML={ html } />
			</Page.TitleCard>

			<Form>
				<Form.Section label={ __( 'Details' ) }>
					<Form.Item label={ __( 'Author' ) } placement="beside">{author}</Form.Item>
					<Form.Item label={ __( 'IP Address' ) } placement="beside">{authorIP}</Form.Item>
					<Form.Item label={ __( 'Email Address' ) } placement="beside">{authorEmail}</Form.Item>
					<Form.Item label={ __( 'Submitted On' ) } placement="beside">{date}</Form.Item>
				</Form.Section>
				<Form.Section label={ __( 'Actions' ) }>
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
				</Form.Section>
			</Form>
		</Page>
	)
}
