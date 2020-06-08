import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default ( { item } ) => {
	const fields = {
		post_title: {
			label: __( 'Title' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a title.' ) )
				}
			}
		},
		post_name: {
			label: __( 'Slug' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a slug.' ) )
				}
			}
		},
		guid: {
			label: __( 'URL' ),
			component: 'url',

		},
		post_status: {
			label: __( 'Status' ),
			labelPlacement: 'beside',
			component: 'plain-text',

		},
		post_date: {
			label: __( 'Publish Date' ),
			labelPlacement: 'beside',
			component: 'calender',
		},
		post_excerpt: {
			label: __( 'Excerpt' ),
			component: 'textarea',
		},
		post_thumbnail: {
			label: __( 'Feature Image' ),
			component: 'image',
			src: item.data.post_thumbnail ? item.data.post_thumbnail.url : '',
		},
		comment_status: {
			label: __( 'Allow Comments' ),
			labelPlacement: 'beside',
			component: 'plain-text',
		},
		ping_status: {
			label: __( 'Allow Pingbacks' ),
			labelPlacement: 'beside',
			component: 'plain-text',
			disable:true
		},
		comments: {
			label: __( 'Comments' ),
			fields: ( { fields } ) => {

				return <List.WordPress
				type={ 'comments' }
				query={ { post__in: [ item.id ] } }
				/>

			}

		}
	}

	const onSubmit = ( { values, setErrors } ) => {
		return cloud.libraries.updateItem( item.id, values ).catch( error => {
			setErrors( error.response.data.errors )
		} )
	}

	const {
		renderForm,
		submitForm,
		isSubmitting
	} = Form.useForm( {
		fields,
		onSubmit,
		defaults: item.data,
	} )

	return (
		<>
			{ renderForm() }
			<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
				{ __( 'Update Item' ) }
			</Button.Loading>
		</>
	)
}
