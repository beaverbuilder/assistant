import React, { useRef } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export const TeamInfo = ( {
	team,
	onUpdate = () => {},
	onDelete = () => {}
} ) => {
	const timeout = useRef( null )

	const checkName = ( name ) => {
		if ( timeout.current ) {
			clearTimeout( timeout.current )
			timeout.current = null
		}
		if ( name === team.name ) {
			return
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

	const deleteTeam = () => {
		if ( confirm( __( 'Do you really want to delete this team?' ) ) ) {
			cloud.teams.delete( team.id ).then( () => {
				onDelete( team.id )
			} )
		}
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
		<>
			<Layout.Box padY={ false }>
				<Page.Section label={ __( 'Information' ) }>
					{ renderForm() }
					<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
						{ __( 'Save Changes' ) }
					</Button.Loading>
				</Page.Section>
			</Layout.Box>
			<Layout.Box>
				<Page.Section label={ __( 'Danger Zone' ) }>
					<Layout.Headline>{ __( 'Delete This Team' ) }</Layout.Headline>
					<p style={ { margin: '0' } }>{ __( 'Once a team has been delete, it is gone forever. Please be sure you want to delete this team.' ) }</p>
				</Page.Section>
				<Button onClick={ deleteTeam } status='destructive'>Delete Team</Button>
			</Layout.Box>
		</>
	)
}
