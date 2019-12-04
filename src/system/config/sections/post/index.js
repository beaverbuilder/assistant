import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig, getSystemActions } from 'data'
import { Form, Control, List } from 'ui'

const { registerSection } = getSystemActions()

registerSection( 'fl-post-title', {
	location: {
		type: 'post',
		tab: 'edit',
	},
	render: ( { useFormData } ) => {
		const { title, slug, url } = useFormData()

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
		tab: 'edit',
	},
	render: ( { useFormData } ) => {
		const { status, visibility, password, date } = useFormData()
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

registerSection( 'fl-post-taxonomies', {
	label: __( 'Taxonomies' ),
	location: {
		type: 'post',
		tab: 'edit',
	},
	isEnabled: ( { useFormData } ) => {
		const { terms } = useFormData()
		return terms.value.length
	},
	render: ( { useFormData } ) => {
		const { terms } = useFormData()
		return Object.keys( terms.value ).map( ( taxonomy, key ) => {
			return (
				<Form.TaxonomyTermsItem
					key={ key }
					taxonomy={ taxonomy }
					value={ terms.value[ taxonomy ] }
					onChange={ value => {
						terms.value[ taxonomy ] = value
						terms.onChange( { ...terms.value } )
					} }
				/>
			)
		} )
	},
} )

registerSection( 'fl-post-excerpt', {
	label: __( 'Excerpt' ),
	location: {
		type: 'post',
		tab: 'edit',
	},
	isEnabled: ( { post } ) => {
		const { contentTypes } = getSystemConfig()
		const { supports } = contentTypes[ post.type ]
		return supports.excerpt
	},
	render: ( { useFormData } ) => {
		const { excerpt } = useFormData()
		return (
			<>
				<Form.TextItem { ...excerpt } />
			</>
		)
	},
} )

registerSection( 'fl-post-attributes', {
	label: __( 'Attributes' ),
	location: {
		type: 'post',
		tab: 'edit',
	},
	isEnabled: ( { post } ) => {
		const { contentTypes } = getSystemConfig()
		const { supports, templates, isHierarchical } = contentTypes[ post.type ]
		const hasTemplates = !! Object.keys( templates ).length
		return hasTemplates || isHierarchical || supports.order
	},
	render: ( { useFormData } ) => {
		const { parent, template, order } = useFormData()
		return (
			<>
				<Form.SelectItem { ...template } />
				<Form.SelectItem { ...parent } />
				<Form.TextItem { ...order } />
			</>
		)
	},
} )

registerSection( 'fl-post-discussion', {
	label: __( 'Discussion' ),
	location: {
		type: 'post',
		tab: 'edit',
	},
	isEnabled: ( { post } ) => {
		const { contentTypes } = getSystemConfig()
		const { supports } = contentTypes[ post.type ]
		return supports.comments || supports.trackbacks
	},
	render: ( { useFormData } ) => {
		const { commentsAllowed, pingbacksAllowed } = useFormData()
		return (
			<>
				<Form.CheckboxItem { ...commentsAllowed } />
				<Form.CheckboxItem { ...pingbacksAllowed } />
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
