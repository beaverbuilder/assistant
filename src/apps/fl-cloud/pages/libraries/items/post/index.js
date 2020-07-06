import React from 'react'
import { useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Nav, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import { getWpRest } from 'assistant/utils/wordpress'

export default ( { item, setItem } ) => {
	const { id, itemId } = useParams()

	const tabs = [
		{
			handle: 'settings',
			label: __( 'Settings' ),
			path: `/fl-cloud/libraries/${ id }/items/${ itemId }`,
			component: () => <ItemSettings item={ item } setItem={ setItem } />,
			exact: true,
		},
		{
			handle: 'import',
			label: __( 'Import' ),
			path: `/fl-cloud/libraries/${ id }/items/${ itemId }/import`,
			component: () => <ItemImport item={ item } setItem={ setItem } />,
		},
	]

	return (
		<>
			<Layout.Box padX={ false }>
				<Nav.Tabs tabs={ tabs } />
			</Layout.Box>
			<Layout.Box padY={ false }>
				<Nav.CurrentTab tabs={ tabs } />
			</Layout.Box>
		</>
	)
}

const ItemSettings = ( { item, setItem } ) => {
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
	}

	const onSubmit = ( { values, setErrors } ) => {
		const requestData = {
			name: values.post_title,
			data: {
				...item.data,
				...values
			}
		}
		return cloud.libraries.updateItem( item.id, requestData ).then( response => {
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

const ItemImport = ( { item, setItem } ) => {


	const importFromLibrary = () => {
		const wpRest = getWpRest()
		wpRest.posts().importFromLibrary( item.id ).then( response => {
			console.log( response )
		} )
	}
	return (
		<>
			<Page.Section label={ __( 'Importing Posts' ) }>
				<div>Clicking import should import the post into the site just like a standard WordPress import. A few things to keep in mind...</div>
				<div>1. The status of imported posts should be draft.</div>
				<div>2. The author should be the current user.</div>
				<div>3. Give options to import meta and terms.</div>
				<br />
				<Button onClick={importFromLibrary}>{ __( 'Import to Site' ) }</Button>
			</Page.Section>
			<Page.Section label={ __( 'Overriding Posts' ) }>
				<div>Clicking override should override the current post you are viewing with the library post...</div>
				<div>1. Give options to override content, meta and terms.</div>
				<br />
				<Button>{ __( 'Override Current Post' ) }</Button>
			</Page.Section>
		</>
	)
}
