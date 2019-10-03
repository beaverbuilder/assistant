import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Button, Form } from 'lib'
import { getSystemConfig } from 'store'
import { getWpRest } from 'shared-utils/wordpress'
import { createSlug } from 'shared-utils/url'

export const CreatePost = () => {
	const { contentTypes } = getSystemConfig()

	const initial = {
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

	const { form, useFormContext, submitForm } = Form.useForm( {
		type: {
			label: __( 'Type' ),
			options: getTypeOptions(),
			id: 'post_type',
		},
		title: {
			label: __( 'Title' ),
			placeholder: __( 'TItle' ),
			id: 'post_title',
		},
		slug: {
			label: __( 'Slug' ),
			placeholder: __( 'my-post-slug' ),
			sanitize: createSlug,
			id: 'post_name',
		},
		parent: {
			label: __( 'Parent' ),
			options: {
				'0': __( 'None' ),
			},
		},
	}, {
		onSubmit: args => {

			const { values, ids } = args
			const data = {}
			const keyMap = ids
			for ( let key in initial ) {
				if ( ! keyMap[ key ] ) {
					continue
				}
				if ( ! values[ key ] ) {
					data[ keyMap[ key ] ] = initial[ key ]
				} else {
					data[ keyMap[ key ] ] = values[ key ]
				}
			}

			// const wpRest = getWpRest()
			// wpRest.posts().create( post, response => {
			// 	setCreating( false )
			// 	if ( response.error ) {
			// 		createError()
			// 	} else {
			// 		presentNotification( sprintf( _x( '%s Created!', 'Singular post type label.' ), labels.singular ) )
			// 		refreshList()
			// 		if ( 'create-edit' === name ) {
			// 			window.open( response.editUrl )
			// 		} else {
			// 			replace( {
			// 				label: contentTypes[ type ].labels.editItem,
			// 				content: <PostListDetail />,
			// 				appearance: 'form',
			// 				shouldShowTitle: false,
			// 				context: {
			// 					refreshList,
			// 					...response,
			// 				},
			// 			}, index )
			// 		}
			// 	}
			// }, createError )
		}
	}, initial )

	const Footer = () => {
		return (
            <>
				<Page.Toolbar>
					<Button type="submit" onClick={ submitForm } >{__( 'Create Draft' )}</Button>
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
