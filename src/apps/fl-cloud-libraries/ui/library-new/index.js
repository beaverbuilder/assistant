import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Layout, Page } from 'assistant/ui'
import cloud from 'assistant/cloud'

import Actions from './actions'
import Items from './items'
import Settings from './settings'
import CreatePosts from './create/posts'
import './style.scss'

export default ( { match } ) => {
	const { id } = match.params
	const [ library ] = cloud.libraries.useOne( id )

	if ( ! library ) {
		return <Page.Loading />
	}

	return (
		<Page
			title={ __( 'Library' ) }
			shouldShowBackButton={ true }
			actions={ <Actions library={ library } /> }
			padX={ false }
			padY={ false }
		>
			<Switch>
				<Route exact path={ `/fl-cloud-libraries/:id` } component={ () => <Items library={ library } /> } />
				<Route path={ `/fl-cloud-libraries/:id/settings` } render={ () => <Settings library={ library } /> } />
				<Route path={ `/fl-cloud-libraries/:id/add/posts` } render={ () => <CreatePosts library={ library } /> } />
			</Switch>
		</Page>
	)
}
