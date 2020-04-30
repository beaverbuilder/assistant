import React, { useRef } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export const TeamInfo = ( {
	team,
	onUpdate = () => {}
} ) => {
	const timeout = useRef( null )

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
		},
		description: {
			label: __( 'Description' ),
			component: 'text',
			alwaysCommit: true,
		},
		url: {
			label: __( 'URL' ),
			component: 'text',
			alwaysCommit: true,
		},
		location: {
			label: __( 'Location' ),
			component: 'text',
			alwaysCommit: true,
		}
	}

	const onSubmit = ( { values, setErrors } ) => {
		return cloud.teams.update( team.id, values ).then( response => {
			onUpdate( response.data )
		} ).catch( error => {
			setErrors( error.errors )
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
		defaults: team
	} )

	return (
		<Layout.Box style={ { paddingTop: '0' } }>
			{ renderForm() }
			<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
				{ __( 'Save Changes' ) }
			</Button.Loading>
		</Layout.Box>
	)
}
