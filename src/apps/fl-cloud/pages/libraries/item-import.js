import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Icon, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'


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
			component: 'plain-text',
			alwaysCommit: true,
		},

	}

	const onSubmit = ( { values, setErrors } ) => {
		/**
		 * Fire import API
		 */
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
		<Page
			title={ __( 'Import Post' ) }
			shouldShowBackButton={ true }
		>
			{ renderForm() }
			<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
				{ __( 'Import Item' ) }
			</Button.Loading>
		</Page>
	)
}
