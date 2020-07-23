import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Layout, Page } from 'assistant/ui'
import cloud from 'assistant/cloud'

import UserLinks from '../user-links'
import Header from './header'
import Toolbar from './toolbar'
import Settings from './settings'
import CreatePosts from './create/posts'
import './style.scss'

export default ( { match } ) => {
	const { id } = match.params
	const [ library ] = cloud.libraries.useOne( id )

	if ( ! library ) {
		return <Page.Loading />
	}

	const PageActions = () => {
		const teamId = 'team' === library.owner_type ? library.owner_id : 0
		return <UserLinks teamId={ teamId } />
	}

	return (
		<Page
			title={ __( 'Library' ) }
			shouldShowBackButton={ true }
			actions={ <PageActions /> }
			padX={ false }
			padY={ false }
		>
			<Header library={ library } />
			<Toolbar library={ library } />
			<Switch>
				<Route exact path={ `/fl-cloud-libraries/:id` } component={ () => <p>Types</p> } />
				<Route path={ `/fl-cloud-libraries/:id/collections` } component={ () => <p>Collections</p> } />
				<Route path={ `/fl-cloud-libraries/:id/settings` } render={ () => <Settings library={ library } /> } />
				<Route path={ `/fl-cloud-libraries/:id/add/posts` } render={ () => <CreatePosts library={ library } /> } />
			</Switch>
		</Page>
	)
}
