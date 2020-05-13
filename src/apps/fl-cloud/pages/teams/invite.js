import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, List, Page } from 'assistant/ui'
import { MembersListAccessory } from './components/members-list-accessory'
import cloud from 'assistant/utils/cloud'

export const TeamInvite = ( { team } ) => {
	const [ email, setEmail ] = useState( '' )
	const [ sending, setSending ] = useState( false )
	const [ success, setSuccess ] = useState( false )
	const [ error, setError ] = useState( false )

	const invite = () => {
		if ( ! email ) {
			return
		}
		setSending( true )
		setSuccess( false )
		setError( false )
		cloud.teams.invite( team.id, email ).then( () => {
			setEmail( '' )
			setSuccess( true )
		} ).catch( error => {
			setError( error.response.data.message )
		} ).finally( () => {
			setSending( false )
		} )
	}

	const items = [
		{ label: 'Billy Young', description: 'billy@young.com', invite: true },
		{ label: 'Robby McCullough', description: 'robby@mccullough.com', invite: true },
		{ label: 'Justin Busa', description: 'justin@busa.com', invite: true }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
			accessory: () => <MembersListAccessory item={ item } />
		}
	}

	return (
		<>
			<Layout.Box padY={ false }>
				<Page.Section
					label={ __( 'Invite' ) }
					padX={ false }
				>
					<Layout.Box
					 	padY={ false }
						style={ {
							display: 'flex',
							flexDirection: 'row',
						} }
					>
						<Form.TextItem
							placeholder="Email Address"
							style={ {
								width: '50%',
								margin: '0 5px 0 0'
							} }
							value={ email }
							onChange={ value => setEmail( value ) }
						></Form.TextItem>
						<Button.Loading
							isLoading={ sending }
							onClick={ invite }
						>
							{ __( 'Invite' ) }
						</Button.Loading>
					</Layout.Box>
					{ success && (
						<Layout.Box padY={ false }>
							<Layout.Message status='primary'>
								{ __( 'Invite sent!' ) }
							</Layout.Message>
						</Layout.Box>
					) }
					{ error && (
						<Layout.Box padY={ false }>
							<Layout.Message status='destructive'>
								{ error }
							</Layout.Message>
						</Layout.Box>
					) }
				</Page.Section>
			</Layout.Box>
			<Layout.Box padY={ false }>
				<Page.Section label={ __( 'Pending Invites' ) } padX={ false }>
					<List
						items={ items }
						getItemProps={ getItemProps }
					/>
				</Page.Section>
			</Layout.Box>
		</>
	)
}
