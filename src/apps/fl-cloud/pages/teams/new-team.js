import React, { useRef } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import { getCloudSelectors } from 'assistant/data'
import cloud from 'assistant/utils/cloud'

export default ( { history, location } ) => {
	const { welcome } = location.state ? location.state : {}
	const timeout = useRef( null )
	const { getCloudUser } = getCloudSelectors()

	const checkName = ( name ) => {
		if ( timeout.current ) {
			clearTimeout( timeout.current )
			timeout.current = null
		}
		timeout.current = setTimeout( () => {
			cloud.teams.nameExists( name ).then( exists => {
				if ( exists ) {
					setErrors( {
						name: 'That name already exists.'
					} )
				}
			} )
		}, 250 )
	}

	const fields = {
		name: {
			label: __( 'Team Name' ),
			component: 'text',
			alwaysCommit: true,
			onChange: ( { value } ) => {
				checkName( value )
			},
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a team name.' ) )
				}
			}
		}
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { name } = values
		const { id } = getCloudUser()
		if ( ! name ) {
			return
		}
		const data = {
			name
		}
		return cloud.teams.create( data ).then( response => {
			history.replace( '/fl-cloud/teams', { id: response.data.id } )
		} ).catch( error => setErrors( error.errors ) )
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
			title={ __( 'New Team' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<Layout.Box>
				{ welcome &&
					<>
						<Layout.Headline>{ __( 'Get Started With Teams!' ) }</Layout.Headline>
						<p>{ __( 'You\'re not part of any teams. Get started by creating a team or receiving an invite from someone you know.' ) }</p>
					</>
				}
				{ ! welcome &&
					<>
						<Layout.Headline>{ __( 'Create a Team' ) }</Layout.Headline>
						<p>{ __( 'Teams allow you to connect and share with other users. Get started by creating a team or receiving an invite from someone you know.' ) }</p>
					</>
				}
				<Page.Section
					label={ __( 'Add New Team' ) }
					className='fl-asst-new-team-form'
				>
					{ renderForm() }
					<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
						{ __( 'Add New Team' ) }
					</Button.Loading>
				</Page.Section>
			</Layout.Box>
		</Page>
	)
}
