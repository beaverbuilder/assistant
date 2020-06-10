import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default ( { history } ) => {
	const [ teams ] = cloud.teams.useAll()
	const [ currentTeam, setCurrentTeam ] = useCurrentTeam()
	const cloudUser = cloud.session.getUser()

	const getOwnerOptions = () => {
		const options = {
			0: sprintf( __( '%s (You)' ), cloudUser.name ),
		}
		if ( teams ) {
			teams.map( team => options[ team.id ] = team.name )
		}
		return options
	}

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
			options: getOwnerOptions()
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { name, description, owner } = values
		const data = {
			name,
			description
		}
		if ( owner ) {
			data.team_id = owner
		}
		return cloud.libraries.create( data ).then( response => {
			const { id } = response.data
			setCurrentTeam( owner )
			history.replace( `/fl-cloud/libraries/${ id }` )
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
