import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form, Control } from 'lib'
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
	label: 'Publish Settings',
	location: {
		type: 'post',
	},
	render: () => (
		<div>Section Two Test</div>
	),
} )

registerSection( 'fl-post-categories', {
	label: 'Categories',
	location: {
		type: 'post',
		tab: 'metadata',
	},
	render: () => (
		<div>Categories</div>
	),
} )

registerSection( 'fl-post-tags', {
	label: 'Tags',
	location: {
		type: 'post',
		tab: 'metadata',
	},
	render: () => (
		<div>Tags</div>
	),
} )
