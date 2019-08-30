import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form, Control, Button } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-post-permalink', {
	label: __( 'Permalink' ),
	location: {
		type: 'post',
	},
	render: ( { post } ) => {
		return (
			<Form.Item>
				<Control.URL url={ post.url } />
			</Form.Item>
		)
	},
} )

registerSection( 'fl-post-publish', {
	label: __( 'Publish Settings' ),
	location: {
		type: 'post',
	},
	render: ( { post } ) => {
		return (
			<>
				<Form.Item label={ __( 'Publish Status' ) } placement="beside">{post.status}</Form.Item>
				<Form.Item label={ __( 'Visibility' ) } placement="beside">{post.visibility}</Form.Item>
				<Form.Item label={ __( 'Parent' ) } placement="beside">{post.parent}</Form.Item>
			</>
		)
	},
} )

registerSection( 'fl-post-categories', {
	label: 'Categories',
	location: {
		type: 'post',
	},
	render: () => (
		<div>Categories</div>
	),
} )

registerSection( 'fl-post-tags', {
	label: 'Tags',
	location: {
		type: 'post',
	},
	render: () => (
		<div>Tags</div>
	),
} )

registerSection( 'fl-post-actions', {
	label: __( 'Actions' ),
	location: {
		type: 'post',
	},
	render: () => (
		<Form.Item>
			<Button.Group appearance="grid">
				<Button>{__( 'View Post' )}</Button>
				<Button>{__( 'Edit in Admin' )}</Button>
				<Button>{__( 'Beaver Builder' )}</Button>
				<Button>{__( 'Bookmark' )}</Button>
				<Button>{__( 'Duplicate' )}</Button>
				<Button>{__( 'Move to Trash' )}</Button>
			</Button.Group>
		</Form.Item>
	),
} )

registerSection( 'fl-post-comments', {
	label: 'Comments',
	location: {
		type: 'post',
		tab: 'comments',
	},
	render: () => (
		<div>Comments List</div>
	),
} )
