import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Button, Form } from 'ui'
import { getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'
import { createSlug } from 'utils/url'
import { setParentOptions } from './parent'

export const CreatePost = ( { history, location } ) => {
	const { contentTypes } = getSystemConfig()
	const wpRest = getWpRest()
	const state = location.state ? location.state : {}
	const { detailBaseUrl } = state

	const getTypeOptions = () => {
		const options = {}
		Object.keys( contentTypes ).map( ( key ) => {
			options[ key ] = contentTypes[ key ].labels.singular
		} )
		return options
	}

	const defaults = {
		type: 'post',
		title: '',
		slug: '',
		parent: 0,
	}

	const sections = {
		info: {
			label: __( 'Basic Info' ),
			fields: {
				type: {
					label: __( 'Type' ),
					labelPlacement: 'beside',
					component: 'select',
					options: getTypeOptions(),
					id: 'post_type',
					onChange: ( { value, setOptions, setIsVisible } ) => {
						setIsVisible( 'parent', contentTypes[ value ].isHierarchical )
						setParentOptions( value, setOptions )
					}
				},
				title: {
					label: __( 'Title' ),
					placeholder: __( 'Title' ),
					component: 'text',
					id: 'post_title',
					onChange: ( { value, setValue } ) => {
						setValue( 'slug', value )
					}
				},
				slug: {
					label: __( 'Slug' ),
					component: 'text',
					placeholder: __( 'my-post-slug' ),
					id: 'post_name',
					sanitize: createSlug,
				},
				parent: {
					label: __( 'Parent' ),
					component: 'select',
					id: 'post_parent',
					isVisible: contentTypes[ defaults.type ].isHierarchical,
					options: ( { state, setOptions } ) => {
						return setParentOptions( state.type.value, setOptions )
					},
				}
			}
		}
	}

	const onSubmit = ( { values, ids } ) => {
		const data = {}

		for ( let key in values ) {
			if ( ids[ key ] ) {
				data[ ids[ key ] ] = values[ key ]
			}
		}

		if ( data.parent ) {
			data.parent = data.parent.split( ':' ).pop()
		}

		const handleError = error => {
			setIsSubmitting( false )
			alert( __( 'Error: Post not created! Please try again.' ) )
			if ( error ) {
				console.log( error ) // eslint-disable-line no-console
			}
		}

		wpRest.posts().create( data ).then( response => {
			const { data } = response
			if ( data.error ) {
				handleError()
			} else if ( detailBaseUrl ) {
				history.replace( `${ detailBaseUrl }/:${ data.id }`, { item: data } )
			} else {
				setIsSubmitting( false )
				alert( __( 'Post not created!' ) )
			}
		} ).catch( error => {
			handleError( error )
		} )
	}

	const {
		renderForm,
		submitForm,
		isSubmitting,
		setIsSubmitting,
	} = Form.useForm( {
		sections,
		defaults,
		onSubmit,
		shouldHighlightChanges: false,
	} )

	const Footer = () => {
		return (
            <span style={{ marginLeft: 'auto' }}>
				{ isSubmitting && <Button.Loading status="primary">{__( 'Creating' )}</Button.Loading> }
				{ ! isSubmitting && <Button type="submit" onClick={ submitForm } status="primary" >{__( 'Create Draft' )}</Button> }
            </span>
		)
	}

	return (
		<Page.NewPage title={ __( 'Create New' ) } footer={ <Footer /> }>
			{ renderForm() }
		</Page.NewPage>
	)
}
