import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Icon, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import LibraryPostItem from './post'

export default () => {
	const history = useHistory()
	const { itemId } = useParams()
	const [ item, setItem ] = cloud.libraries.useItem( itemId )
	const forms = {
		'default': LibraryDefaultItem,
		'post': LibraryPostItem
	}

	if ( ! item ) {
		return <Page.Loading />
	}

	const deleteItem = () => {
		if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
			cloud.libraries.deleteItem( item.id )
			history.goBack()
		}
	}

	let LibraryItemForm = forms.default
	if ( forms[ item.type ] ) {
		LibraryItemForm = forms[ item.type ]
	}

	return (
		<Page
			title={ __( 'Library Item' ) }
			shouldShowBackButton={ true }
			padX={ false }
		>
			<Layout.Box
				padY={ false }
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
			<LibraryItemForm
				item={ item }
				setItem={ setItem }
			/>
		</Page>
	)
}

const LibraryDefaultItem = ( { item, setItem } ) => {
	const fields = {
		name: {
			label: __( 'Name' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a name.' ) )
				}
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { name } = values
		const data = {
			name
		}
		return cloud.libraries.updateItem( item.id, data ).then( response => {
			setItem( response.data )
		} ).catch( error => {
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
		defaults: item,
	} )

	return (
		<Layout.Box padY={ false }>
			{ renderForm() }
			<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
				{ __( 'Update Item' ) }
			</Button.Loading>
		</Layout.Box>
	)
}
