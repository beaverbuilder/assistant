import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page } from '../'

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

	const item = 'undefined' !== typeof location.state ? location.state : defaultItem
	const { content, author } = item
	const html = { __html: content }

	return (
		<Page title={__( 'Comment' )}>
			<h2>{author} said:</h2>
			<div dangerouslySetInnerHTML={html} />
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

	const item = 'undefined' !== typeof location.state ? location.state : defaultItem

	const { type, banner, title, content } = item

	const contentHTML = { __html: content }
	const pageType = 'plugin' === type ? __( 'Plugin' ) : __( 'Theme' )

	return (
		<Page shouldPadSides={false} title={pageType}>
			{ banner && <img src={banner} /> }

			<Page.Pad>
				<h1>{title}</h1>
				<div dangerouslySetInnerHTML={contentHTML} />
			</Page.Pad>
		</Page>
	)
}

export const Post = ( { location } ) => {
	const defaultItem = {
		author: null,
		bbBranding: null,
		bbCanEdit: true,
		bbEditUrl: null,
		bbIsEnabled: null,
		commentsAllowed: null,
		content: null,
		date: null,
		editUrl: null,
		id: null,
		meta: null,
		parent: 0,
		slug: null,
		status: null,
		thumbnail: null,
		title: null,
		type: 'post',
		url: null,
		visibility: 'Public',
	}
	const item = 'undefined' !== typeof location.state ? location.state : defaultItem
	const { title, thumbnail, url } = item

	return (
		<Page>
			{ thumbnail && <img src={thumbnail} /> }
			<h2>{title}</h2>
			<div>
				<a href={url}><em>{url}</em></a>
			</div>
		</Page>
	)
}

export const Attachment = () => {
	return (
		<Page>
			<h1>I am an Attachment</h1>
		</Page>
	)
}
