import React, { useRef } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Page } from 'assistant/ui'
import { getCloudSelectors } from 'assistant/data'
import cloud from 'assistant/utils/cloud'

export const NewTeamForm = ( {
	onCreated = () => {}
} ) => {
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
			name,
			owner_id: id
		}
		return cloud.teams.create( data ).then( team => {
			onCreated( team )
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
		<Page.Section
			label={ __( 'Add New Team' ) }
			className='fl-asst-new-team-form'
		>
			{ renderForm() }
			<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
				{ __( 'Add New Team' ) }
			</Button.Loading>
		</Page.Section>
	)
}
