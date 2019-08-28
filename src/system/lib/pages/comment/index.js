import React from 'fl-react'
import { __, sprintf } from '@wordpress/i18n'
import { Page, Form } from 'lib'

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

	return (
		<Page title={ __( 'Edit Comment' ) } shouldPadSides={ false }>

			<Page.Section label={ sprintf( '%s Said:', author ) }>
				<div dangerouslySetInnerHTML={ html } />
			</Page.Section>

			<Form>
				<Form.Section label={ __( 'Details' ) }>
					<Form.Item label={ __( 'Author' ) } placement="beside">{author}</Form.Item>
					<Form.Item label={ __( 'IP Address' ) } placement="beside">{authorIP}</Form.Item>
					<Form.Item label={ __( 'Email Address' ) } placement="beside">{authorEmail}</Form.Item>
					<Form.Item label={ __( 'Submitted On' ) } placement="beside">{date}</Form.Item>
				</Form.Section>
			</Form>
		</Page>
	)
}
