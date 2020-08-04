import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/cloud'
import { getFormSections, getFormDefaults, getFormData } from '../form'
import ItemContext from '../context'
import ItemHero from '../hero'

export default () => {
	const { item, setItem, renderNotices } = ItemContext.use()

	const onSubmit = ( { values, setErrors } ) => {
		const data = getFormData( values )
		return cloud.libraries.updateItem( item.id, data ).then( response => {
			setItem( response.data )
		} ).catch( error => {
			setErrors( error.response.data.errors )
		} )
	}

	const {
		renderForm,
		submitForm,
		resetForm,
		isSubmitting,
		hasChanges
	} = Form.useForm( {
		defaults: getFormDefaults(),
		sections: getFormSections(),
		onSubmit,
	} )

	const PublishActions = () => {
		return (
			<Layout.PublishBar
				onPublish={ submitForm }
				onDiscard={ resetForm }
			/>
		)
	}

	return (
		<Page
			title={ __( 'Library Item' ) }
			shouldShowBackButton={ true }
			notices={ renderNotices() }
			hero={ <ItemHero /> }
			footer={ hasChanges && <PublishActions /> }
		>
			{ renderForm() }
		</Page>
	)
}
