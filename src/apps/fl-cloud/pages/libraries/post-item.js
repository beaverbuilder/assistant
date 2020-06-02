import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Icon, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import PostItem from './post-item'


export default () => {
	const { itemId } = useParams()
	const [ item ] = cloud.libraries.useItem( itemId )

	if ( ! item ) {
		return <Page.Loading />
	}

	return <Item item={ item } />
}

const Item = ( { item } ) => {
	const history = useHistory()

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
			src: item.data.post_thumbnail.url,
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

	const deleteItem = () => {
		if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
			cloud.libraries.deleteItem( item.id )
			history.goBack()
		}
	}



	return (
		<Page
			title={ __( 'Library Item' ) }
			shouldShowBackButton={ true }
		>
			<Layout.Box
				padY={ false }
				padX={ false }
				style={ {
					flexDirection: 'row',
					alignItems: 'center',
					paddingTop: 'var(--fluid-sm-space)'
				} }
			>
				<Layout.Headline style={ { width: '100%' } }>
					{ item.name }
				</Layout.Headline>
				<Button
					style={ { marginLeft: '10px' } }
					status='destructive'
					onClick={ deleteItem }
				>
					<Icon.Trash />
				</Button>
			</Layout.Box>
			{ renderForm() }
			<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
				{ __( 'Update Item' ) }
			</Button.Loading>
		</Page>
	)
}
