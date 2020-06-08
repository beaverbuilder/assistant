import React, { useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Button, Form } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import { getWpRest } from 'assistant/utils/wordpress'
import { getSystemConfig } from 'assistant/data'


export default ( { libraryId, onCreate } ) => {
	const [ type, setType ] = useState( null )
	const [ posts, setPosts ] = useState( null )
	const [ loading, setLoading ] = useState( false )
	const [ postData, setpostData ] = useState( null )
	const wpRest = getWpRest()
	const { contentTypes } = getSystemConfig()

	const getPostLabels = () => {
		if ( type ) {
			return contentTypes[ type ].labels
		}
		return {
			singular: __( 'Post' ),
			plural: __( 'Posts' ),
		}
	}


	const fields = {
		type: {
			label: __( 'Post Type' ),
			component: 'select',
			alwaysCommit: true,
			isLoading: loading,
			options: () => {
				const options = {
					0: __( 'Choose...' ),
				}
				Object.entries( contentTypes ).map(
					( [ key, value ] ) => options[ key ] = value.labels.singular
				)
				return options
			},
			onChange: ( { value } ) => {
				setType( null )
				setPosts( null )
				if ( '0' !== value ) {
					const data = {
						post_type: value,
						orderby: 'title',
						order: 'ASC',
						posts_per_page: -1
					}
					setType( value )
					setLoading( true )
					wpRest.posts().findWhere( data ).then( response => {
						setPosts( response.data.items )
						setLoading( false )
					} )
				}
			},
			validate: ( value, errors ) => {
				if ( ! value || 'choose' === value ) {
					errors.push( __( 'Please choose a post type.' ) )
				}
			}
		},
		slug: {
			label: getPostLabels().singular,
			component: 'select',
			alwaysCommit: true,
			isVisible: !! posts,
			options: () => {
				const options = {
					0: __( 'Choose...' ),
				}
				if ( posts && posts.length ) {
					posts.map( post => options[ post.slug ] = post.title )
				}
				return options
			},
			validate: ( value, errors ) => {
				if ( ! value || 'choose' === value ) {
					errors.push( __( 'Please choose an item.' ) )
				}
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { slug } = values
		const post = posts.filter( post => post.slug === slug ).pop()
		wpRest.posts().formedPost( post.id ).then( response => {
			return cloud.libraries.createItem( libraryId, {
				type: 'post',
				name: post.title,
				data: response.data

			} ).then( () => {
				onCreate()
			} ).catch( error => {
				setErrors( error.response.data.errors )
			} )
		} )

	}

	const {
		renderForm,
		submitForm,
		isSubmitting
	} = Form.useForm( {
		fields,
		onSubmit
	} )

	return (
		<>
			{ renderForm() }
			<Button.Loading isLoading={ isSubmitting } onClick={ submitForm }>
				{ sprintf( __( 'Add %s' ), getPostLabels().singular ) }
			</Button.Loading>
		</>
	)
}
