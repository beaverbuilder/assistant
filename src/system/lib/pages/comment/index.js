import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Page, Form, Control } from 'lib'

export const Comment = ( { location, match, history } ) => {

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
	const { content, author } = item
	const html = { __html: content }

	const Actions = () => {
		return (
			<Control.NextPrev
				onPrev={ () => {} }
				onNext={ () => {} }
			/>
		)
	}

	const sectionData = {
		comment: item,
		actions: [
			{
				label: __( 'View Post' ),
				href: '#',
			},
			{
				label: __( 'Edit Comment' ),
				onClick: () => {},
			},
			{
				label: __( 'Reply to Comment' ),
				onClick: () => {},
			},
			{
				label: __( 'Approve Comment' ),
				onClick: () => {},
			},
			{
				label: __( 'Mark as Spam' ),
				onClick: () => {},
			},
			{
				label: __( 'Move to Trash' ),
				onClick: () => {},
			},
		],
		nav: { history, location, match }
	}

	return (
		<Page title={ __( 'Edit Comment' ) } shouldPadSides={ false } headerActions={ <Actions /> }>

			<Page.TitleCard>
				<h2>{sprintf( '%s Said:', author )}</h2>
				<div dangerouslySetInnerHTML={ html } />
			</Page.TitleCard>

			<Form>
				<Page.RegisteredSections
					location={ { type: 'comment' } }
					data={ sectionData }
				/>
			</Form>
		</Page>
	)
}
