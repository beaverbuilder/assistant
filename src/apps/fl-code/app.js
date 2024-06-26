import React from 'react'
import { __ } from '@wordpress/i18n'
import * as CloudUI from '@beaverbuilder/cloud-ui'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Page, Layout } from 'assistant/ui'
import { PostTypeTab } from './tabs'
import AppIcon from './icon'

export default ( { baseURL } ) => (
	<Switch>
		<Route exact path={ baseURL }>
			<Redirect to={ { pathname: `${baseURL}/tab/fl_code` } } />
		</Route>
		<Route path={ `${baseURL}/tab/:tab` } component={ Main } />
		<Route path={ `${baseURL}/fl_code/new` } component={ Page.CreatePost } />
		<Route path={ `${baseURL}/fl_code/:id` } component={ ( { location, match, history } ) => {
			return (
				<Page.Code
					location={ location }
					match={ match }
					history={ history }
					CloudUI={ CloudUI } // Cannot be accessed from system pages yet. Must pass through.
				/>
			)
		} } />
	</Switch>
)

const Main = ( { baseURL } ) => {

	const Header = () => {
		return (
			<Layout.Tabs tabs={ tabs } shouldHandleOverflow={ true } />
		)
	}

	const tabs = [
		{
			handle: 'fl_code',
			path: '/fl-code/tab/fl_code',
			label: 'CSS',
			component: () => <PostTypeTab type={ 'CSS' } />,
		},
		{
			handle: 'fl_js',
			path: '/fl-code/tab/fl_js',
			label: 'JavaScript',
			component: () => <PostTypeTab type={ 'JavaScript' } />,
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
