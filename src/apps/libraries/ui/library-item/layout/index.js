import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form, Layout, Page } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import cloud from 'assistant/cloud'
import { getFormTabs, getFormDefaults, getFormData } from '../form'
import LibraryContext from '../../library/context'
import ItemContext from '../context'
import ItemHero from '../hero'

export default () => {
	const { itemTypes } = useAppState( 'libraries', 'itemTypes' )
	const { items, setItems } = LibraryContext.use()
	const { item, setItem, renderNotices } = ItemContext.use()

	const onSubmit = ( { values, setErrors } ) => {
		const data = getFormData( item, values )
		return cloud.libraries.updateItem( item.id, data ).then( response => {
			setItem( response.data )
			setItems( items.map( item => item.id === response.data.id ? response.data : item ) )
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

	const getPageTitle = () => {
		if ( itemTypes[ item.type ] ) {
			return itemTypes[ item.type ].labels.singular
		}
		return __( 'Library Item' )
	}

	return (
		<div
			style={ {
				position: 'absolute',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				width: '100%'
			} }
		>
			<Page
				title={ getPageTitle() }
				shouldShowBackButton={ true }
				notices={ renderNotices() }
				hero={ <ItemHero /> }
				footer={ hasChanges && <PublishActions /> }
				className='fl-asst-library-item'
			>
				{ renderForm() }
			</Page>
		</div>
	)
}
