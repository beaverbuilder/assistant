import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Button, Form } from 'lib'
import { getSystemConfig } from 'store'
import { getWpRest } from 'shared-utils/wordpress'
import { createSlug } from 'shared-utils/url'
import { setParentOptions } from './parent'

export const CreatePost = ( { history, location } ) => {
	const { contentTypes } = getSystemConfig()
	const wpRest = getWpRest()
	const state = location.state ? location.state : {}
	const { detailBaseUrl } = state

	const defaults = {
		type: 'post',
		title: '',
		slug: '',
		parent: 0,
	}

	const getTypeOptions = () => {
		const options = {}
		Object.keys( contentTypes ).map( ( key ) => {
			options[ key ] = contentTypes[ key ].labels.singular
		} )
		return options
	}

	const {
		form,
		useFormContext,
		submitForm,
		isSubmitting,
		setIsSubmitting,
	} = Form.useForm( {
		type: {
			label: __( 'Type' ),
			labelPlacement: 'beside',
			options: getTypeOptions(),
			id: 'post_type',
			onChange: ( { value, setOptions, setIsVisible } ) => {
				setIsVisible( 'parent', contentTypes[ value ].isHierarchical )
				setParentOptions( value, setOptions )
			}
		},
		title: {
			label: __( 'Title' ),
			placeholder: __( 'TItle' ),
			id: 'post_title',
			onChange: ( { value, setValue } ) => {
				setValue( 'slug', value )
			}
		},
		slug: {
			label: __( 'Slug' ),
			placeholder: __( 'my-post-slug' ),
			sanitize: createSlug,
			id: 'post_name',
		},
		parent: {
			label: __( 'Parent' ),
			options: ( { state, setOptions } ) => {
				return setParentOptions( state.type.value, setOptions )
			},
			isVisible: contentTypes[ defaults.type ].isHierarchical
		},
	}, {
		shouldHighlightChanges: false,
		onSubmit: ( { values, ids } ) => {
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
	}, defaults )

	const Footer = () => {
		return (
            <>
				<Page.Toolbar>
					{ isSubmitting && <Button.Loading>{__( 'Creating' )}</Button.Loading> }
					{ ! isSubmitting && <Button type="submit" onClick={ submitForm } >{__( 'Create Draft' )}</Button> }
				</Page.Toolbar>
            </>
		)
	}

	return (
		<Page title={ __( 'Create New' ) } shouldPadSides={ false } footer={ <Footer /> }>
			<Form { ...form }>
				<Page.RegisteredSections
					location={ { type: 'create-post' } }
					data={ {
						useForm: useFormContext
					} }
				/>
			</Form>
		</Page>
	)
}
