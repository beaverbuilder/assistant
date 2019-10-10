import React, { useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'shared-utils/wordpress'
import { createSlug } from 'shared-utils/url'
import { getSystemActions, getSystemConfig } from 'store'
import { Form, Control, List } from 'lib'

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

registerSection( 'fl-post-taxonomies', {
	label: __( 'Taxonomies' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const [ data, setData ] = useState( {} )
		const [ creating, setCreating ] = useState( {} )
		const { taxonomies } = getSystemConfig()
		const { terms } = useForm()
		const wpRest = getWpRest()

		const requestData = ( taxonomy ) => {
			if ( ! ( taxonomy in data ) ) {
				data[ taxonomy ] = { terms: [], idsBySlug: {}, slugsById: {} }
				setData( { ...data } )
				wpRest.terms().hierarchical( {
					taxonomy,
					hide_empty: 0,
					orderby: 'name',
					order: 'ASC',
				} ).then( response => {
					data[ taxonomy ].terms = response.data
					data[ taxonomy ] = flattenResponseData( response.data, data[ taxonomy ] )
					setData( { ...data } )
				} )
			}
		}

		const flattenResponseData = ( data, flattened ) => {
			data.map( term => {
				flattened.slugsById[ term.id ] = term.slug
				flattened.idsBySlug[ term.slug ] = term.id
				if ( term.children.length ) {
					flattened = flattenResponseData( term.children, flattened )
				}
			} )
			return flattened
		}

		const getHierarchicalOptions = ( terms, options = [], depth = 0 ) => {
			terms.map( term => {
				options[ term.slug ] = depth ? '-'.repeat( depth ) + ' ' + term.title : term.title
				if ( term.children.length ) {
					options = getHierarchicalOptions( term.children, options, depth + 1 )
				}
			} )
			return options
		}

		const renderField = ( taxonomy, key ) => {
			const tax = taxonomies[ taxonomy ]
			const options = getHierarchicalOptions( data[ taxonomy ].terms )
			const values = terms.value[ taxonomy ].map( id => data[ taxonomy ].slugsById[ id ] )

			if ( tax.isHierarchical ) {
				return (
					<Form.SelectItem
						key={ key }
						label={ tax.labels.plural }
						selectMultiple={ true }
						options={ options }
						value={ values }
						onChange={ values => {
							terms.value[ taxonomy ] = values.map( value => data[ taxonomy ].idsBySlug[ value ] )
							terms.onChange( { ...terms.value } )
						} }
					/>
				)
			} else {
				return (
					<Form.Item
						key={ key }
						label={ tax.labels.plural }
						labelForm={ `taxonomy-${ taxonomy }` }
					>
						<Control.TagGroup
							options={ options }
							value={ values }
							onRemove={ ( value, index ) => {
								terms.value[ taxonomy ].splice( index, 1 )
								terms.onChange( { ...terms.value } )
							} }
							onAdd={ value => {
								const slug = createSlug( value )
								const key = data[ taxonomy ].terms.length

								if ( slug in data[ taxonomy ].idsBySlug ) {
									const id = data[ taxonomy ].idsBySlug[ slug ]
									if ( ! terms.value[ taxonomy ].includes( id ) ) {
										terms.value[ taxonomy ].push( id )
										terms.onChange( { ...terms.value } )
									}
									return
								}

								data[ taxonomy ].terms.push( {
									slug,
									id: slug,
									title: value,
									children: [],
								} )

								data[ taxonomy ].idsBySlug[ slug ] = slug
								data[ taxonomy ].slugsById[ slug ] = slug

								terms.value[ taxonomy ].push( slug )
								terms.onChange( { ...terms.value } )

								wpRest.terms().create( {
									taxonomy,
									slug,
									name: value,
									parent: '0',
									description: '',
								} ).then( response => {
									data[ taxonomy ].terms[ key ] = response.data
									data[ taxonomy ].idsBySlug[ slug ] = response.data.id
									data[ taxonomy ].slugsById[ response.data.id ] = slug
									delete data[ taxonomy ].slugsById[ slug ]

									if ( terms.value[ taxonomy ].includes( slug ) ) {
										const index = terms.value[ taxonomy ].indexOf( slug )
										terms.value[ taxonomy ].splice( index, 1, response.data.id )
										terms.onChange( { ...terms.value } )
									}
								} )
							} }
						/>
					</Form.Item>
				)
			}
		}

		return Object.keys( terms.value ).map( ( taxonomy, key ) => {
			requestData( taxonomy )
			return renderField( taxonomy, key )
		} )
	},
} )

registerSection( 'fl-post-excerpt', {
	label: __( 'Excerpt' ),
	location: {
		type: 'post',
	},
	render: ( { useForm } ) => {
		const { excerpt } = useForm()
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
	},
	render: ( { useForm } ) => {
		const { parent, template, order } = useForm()
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
	},
	render: ( { useForm } ) => {
		const { commentsAllowed, pingbacksAllowed } = useForm()
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
