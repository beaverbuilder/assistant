import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/cloud'
import { getFormTabs, getFormDefaults, getFormData } from '../form'
import ItemContext from '../context'
import ItemHero from '../hero'

export default () => {
	const { item, setItem, renderNotices } = ItemContext.use()

	const onSubmit = ( { values, setErrors } ) => {
		const data = getFormData( item, values )
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
		hasChanges
	} = Form.useForm( {
		...getFormTabs( item ),
		defaults: getFormDefaults( item ),
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
			className='fl-asst-library-item'
		>
			{ renderForm() }
		</Page>
	)
}
