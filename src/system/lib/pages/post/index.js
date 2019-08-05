import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page } from 'lib'

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
	const item = 'undefined' !== typeof location.state.item ? location.state.item : defaultItem
	const { title, thumbnail, url } = item

	return (
		<Page title={__( 'Post' )}>
			{ thumbnail && <img src={thumbnail} /> }
			<h2>{title}</h2>
			<div>
				<a href={url}><em>{url}</em></a>
			</div>

			<Page.ExpandedContent>
				This should only show when expanded.
			</Page.ExpandedContent>
		</Page>
	)
}

export const CreatePost = () => {
	return (
		<Page title={__( 'Create' )}>
			<h1>Create new post</h1>
		</Page>
	)
}
