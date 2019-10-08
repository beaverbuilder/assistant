import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form, Control, List } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-post-title', {
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { title, slug, url } = useForm()

		return (
			<>
				<Form.TextItem { ...title } />
				<Form.TextItem { ...slug } />
				<Form.Item label={ url.label }>
					<Control.URL
						id={ url.id }
						value={ url.value }
					/>
				</Form.Item>
			</>
		)
	},
} )

registerSection( 'fl-post-publish', {
	label: __( 'Publish Settings' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { status, visibility, password, date } = useForm()
		return (
			<>
				<Form.PlainTextItem { ...status } />
				<Form.SelectItem { ...visibility } />
				<Form.TextItem { ...password } />
				<Form.PlainTextItem { ...date } />
			</>
		)
	},
} )

registerSection( 'fl-post-attributes', {
	label: __( 'Attributes' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { parent } = useForm()
		return (
			<>
				<Form.SelectItem { ...parent } />
			</>
		)
	},
} )

registerSection( 'fl-post-cats-tags', {
	label: __( 'Categories & Tags' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { tags } = useForm()

		return (
			<>
				<Form.Item label={ tags.label } labelForm={ tags.id }>
					<Control.TagGroup value={ tags.value } />
				</Form.Item>
			</>
		)
	},
} )

registerSection( 'fl-post-comments', {
	label: 'Comments',
	location: {
		type: 'post',
		tab: 'comments',
	},
	contentStyle: { padding: 0 },
	render: ( { post } ) => {
		return (
			<List.Comments
				query={ { post__in: [ post.id ] } }
				getItemProps={ ( item, defaultProps ) => ( {
					...defaultProps,
					to: {
						pathname: `/fl-comments/comment/${item.id}`,
						state: { item }
					},
				} ) }
			/>
		)
	},
} )


// Create Post Screen
registerSection( 'fl-new-post-title', {
	label: 'Basic Info',
	location: {
		type: 'create-post',
	},
	render: ( { useForm } ) => {
		const { type, title, slug, parent } = useForm()
		return (
			<>
				<Form.SelectItem { ...type } />
				<Form.TextItem { ...title } />
				<Form.TextItem { ...slug } />
				<Form.SelectItem { ...parent } />
			</>
		)
	},
} )
