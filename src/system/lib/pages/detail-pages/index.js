import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page } from 'lib'

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

	const item = 'undefined' !== typeof location.state.item ? location.state.item : defaultItem
	const { content, author } = item
	const html = { __html: content }

	return (
		<Page title={ __( 'Comment' ) }>
			<h2>{author} said:</h2>
			<div dangerouslySetInnerHTML={ html } />
		</Page>
	)
}

export const Update = ( { location = {} } ) => {

	const defaultItem = {
		author: null,
		banner: null,
		content: null,
		key: null,
		meta: null,
		metaUpdated: null,
		plugin: null,
		thumbnail: null,
		title: null,
		type: 'plugin',
		version: null,
	}

	const item = 'undefined' !== typeof location.state.item ? location.state.item : defaultItem

	const { type, banner, title, content } = item

	const contentHTML = { __html: content }
	const pageType = 'plugin' === type ? __( 'Plugin' ) : __( 'Theme' )

	return (
		<Page shouldPadSides={ false } title={ pageType }>
			{ banner && <img src={ banner } /> }

			<Page.Pad>
				<h1>{title}</h1>
				<div dangerouslySetInnerHTML={ contentHTML } />
			</Page.Pad>
		</Page>
	)
}

export const User = ( { location } ) => {
	const defaultItem = {}
	const item = 'undefined' !== typeof location.state.item ? location.state.item : defaultItem
	console.log( 'user', item )
	return (
		<Page>
			<h1>I am an User</h1>
		</Page>
	)
}
