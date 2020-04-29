import React from 'react'
import { __ } from '@wordpress/i18n'
import { Layout, Page } from 'assistant/ui'
import { NewTeamForm } from './new-team-form'

export default ( { history } ) => {
	return (
		<Page
			title={ __( 'New Team' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<Layout.Box>
				<Layout.Headline>{ __( 'Create a Team' ) }</Layout.Headline>
				<p>{ __( 'Teams allow you to connect and share with other users. Get started by creating a team or receiving an invite from someone you know.' ) }</p>
				<NewTeamForm
					onCreated={ () => {
						history.replace( '/fl-cloud/teams' )
					} }
				/>
			</Layout.Box>
		</Page>
	)
}
