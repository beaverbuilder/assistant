import React, { useRef } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export const NewTeamForm = ( {
	onCreated = () => {}
} ) => {
	const timeout = useRef( null )

	const checkName = ( name ) => {
		if ( timeout.current ) {
			clearTimeout( timeout.current )
			timeout.current = null
		}
		timeout.current = setTimeout( () => {
			cloud.teams.nameExists( name ).then( exists => {
				console.log( exists )
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

	const onSubmit = ( { values } ) => {
		const { name } = values
		if ( ! name ) {
			return
		}
		return cloud.teams.create( { name } ).then( team => {
			onCreated( team )
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
