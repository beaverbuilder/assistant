import React from 'react'
import { __ } from '@wordpress/i18n'
import * as CloudUI from '@beaverbuilder/cloud-ui'
import { Redirect, Switch, Route } from 'react-router-dom'
import { getSystemConfig } from 'assistant/data'
import { Page, Layout } from 'assistant/ui'
import { PostTypeTab } from './tabs'
import AppIcon from './icon'
import './style.scss'

export default ( { baseURL } ) => (
	<Switch>
		<Route exact path={ baseURL }>
			<Redirect to={ { pathname: `${baseURL}/tab/post` } } />
		</Route>
		<Route path={ `${baseURL}/tab/:tab` } component={ Main } />
		<Route path={ `${baseURL}/post/new` } component={ Page.CreatePost } />
		<Route path={ `${baseURL}/post/:id` } component={ ( { location, match, history } ) => {
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
	const getTabs = () => {
		let tabs = []
		Object.keys( contentTypes ).map( key => {
			if( 'fl_css' !== key && 'fl_js' !== key ) {
				const type = contentTypes[key]
				tabs.push( {
					handle: key,
					path: '/fl-content/tab/' + key,
					label: type.labels.plural,
					component: () => <PostTypeTab type={ key } />,
				} )
			}
		} )

		return tabs
	}

	const Header = () => {
		return (
			<Layout.Tabs tabs={ tabs } shouldHandleOverflow={ true } />
		)
	}

	const tabs = getTabs()

	const onLoad = () => {
		const item = document.querySelector( '.fl-asst-filter .fluid-button' )
		if ( item ) {
			item.focus()
		}
	}

	return (
		<Page
			id="fl-asst-content-list-page"
			title={ __( 'Content' ) }
			icon={ <AppIcon context="sidebar" /> }
			padY={ false }
			header={ <Header /> }
			topContentStyle={ { border: 'none' } }
			shouldScroll={ false }
			shouldShowBackButton={ false }
			showAsRoot={ true }
			onLoad={ onLoad }
		>
			<Layout.CurrentTab tabs={ tabs } />
		</Page>
	)
}
