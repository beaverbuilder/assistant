import React from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default ( { library } ) => {
	const history = useHistory()

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
		description: {
			label: __( 'Description' ),
			component: 'text',
			alwaysCommit: true
		},
		owner: {
			label: __( 'Owner' ),
			component: 'select',
			alwaysCommit: true,
			options: {
				you: __( 'Justin Busa (You)' ),
				bb: __( 'Beaver Builder' ),
				db: __( 'Dickiebirds' ),
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		return cloud.libraries.update( library.id, values ).catch( error => {
			setErrors( error.response.data.errors )
		} )
	}

	const {
		renderForm,
		submitForm,
		isSubmitting,
		setErrors
	} = Form.useForm( {
		fields,
		onSubmit,
		defaults: library,
	} )

	const deleteLibrary = () => {
		if ( confirm( __( 'Do you really want to delete this library?' ) ) ) {
			cloud.libraries.delete( library.id ).then( () => {
				history.replace( '/fl-cloud' )
			} )
		}
	}

	return (
		<>
			<Layout.Box>
				{ renderForm() }
				<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
					{ __( 'Update Library' ) }
				</Button.Loading>
			</Layout.Box>
			<Layout.Box>
				<Page.Section label={ __( 'Danger Zone' ) }>
					<Layout.Headline>{ __( 'Delete This Library' ) }</Layout.Headline>
					<p style={ { margin: '0' } }>{ __( 'Once a library has been deleted, it is gone forever. Please be sure you want to delete this library.' ) }</p>
				</Page.Section>
				<Button onClick={ deleteLibrary } status='destructive'>Delete Library</Button>
			</Layout.Box>
		</>
	)
}
