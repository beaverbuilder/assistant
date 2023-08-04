import React from 'react'
import { __ } from '@wordpress/i18n'
import * as CloudUI from '@beaverbuilder/cloud-ui'
import { Redirect, Switch, Route } from 'react-router-dom'
import { getSystemConfig } from 'assistant/data'
import { Page, Layout } from 'assistant/ui'
import { PostTypeTab } from './tabs'
import AppIcon from './icon'

export default ( { baseURL } ) => (
	<Switch>
		<Route exact path={ baseURL }>
			<Redirect to={ { pathname: `${baseURL}/tab/fl-css` } } />
		</Route>
		<Route path={ `${baseURL}/tab/:tab` } component={ Main } />
		<Route path={ `${baseURL}/fl-css/new` } component={ Page.CreatePost } />
		<Route path={ `${baseURL}/fl-css/:id` } component={ ( { location, match, history } ) => {
			return (
				<Page.Post
					location={ location }
					match={ match }
					history={ history }
					CloudUI={ CloudUI } // Cannot be accessed from system pages yet. Must pass through.
				/>
			)
		} } />
	</Switch>
)

const Main = () => {
	const { contentTypes } = getSystemConfig()

	const Header = () => {
		return (
			<Layout.Tabs tabs={ tabs } shouldHandleOverflow={ true } />
		)
	}

	const tabs = [
		{
			handle: 'fl-css',
			path: '/fl-code/tab/fl-css',
			label: 'CSS',
			component: () => <PostTypeTab type={ 'fl-css' } />,
		},
		{
			handle: 'fl-js',
			path: '/fl-code/tab/fl-js',
			label: 'JavaScript',
			component: () => <PostTypeTab type={ 'fl-js' } />,
		}
	]

	return (
		<Page
			id="fl-asst-code-list-page"
			title={ __( 'Code' ) }
			icon={ <AppIcon context="sidebar" /> }
			padY={ false }
			header={ <Header /> }
			topContentStyle={ { border: 'none' } }
			shouldScroll={ false }
			shouldShowBackButton={ false }
			showAsRoot={ true }
		>
			<Layout.CurrentTab tabs={ tabs } />
		</Page>
	)
}
