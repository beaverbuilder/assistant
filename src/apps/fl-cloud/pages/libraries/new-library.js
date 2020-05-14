import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default ( { history, location } ) => {
	const [ teams, setTeams ] = cloud.teams.useAll()

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
		return cloud.libraries.create( values ).then( response => {
			history.replace( '/fl-cloud' )
		} ).catch( error => {
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
		onSubmit
	} )

	return (
		<Page
			title={ __( 'New Library' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<Layout.Box>
				<Layout.Headline>{ __( 'Create a Library' ) }</Layout.Headline>
				<p>{ __( 'A library is a container that syncs between sites via the cloud. Libraries can hold creative assets like images, icons, and templates.' ) }</p>
				<Page.Section
					label={ __( 'Add New Library' ) }
					className='fl-asst-new-library-form'
				>
					{ renderForm() }
					<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
						{ __( 'Add New Library' ) }
					</Button.Loading>
				</Page.Section>
			</Layout.Box>
		</Page>
	)
}
