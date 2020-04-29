import React from 'react'
import { __ } from '@wordpress/i18n'
import { Redirect } from 'react-router-dom'
import { getSystemConfig } from 'assistant/data'
import { Page, Nav } from 'assistant/ui'
import { PostTypeTab } from './tabs'
import AppIcon from './icon'
import './style.scss'

const Content = () => {
	const baseURL = '/fl-content'
	return (
		<Nav.Switch>
			<Nav.Route exact path={ baseURL }>
				<Redirect to={ { pathname: `${baseURL}/tab/post` } } />
			</Nav.Route>
			<Nav.Route path={ `${baseURL}/tab/:tab` } component={ Main } />
			<Nav.Route path={ `${baseURL}/post/new` } component={ Page.CreatePost } />
			<Nav.Route path={ `${baseURL}/post/:id` } component={ Page.Post } />
		</Nav.Switch>
	)
}

const Main = () => {
	const { contentTypes } = getSystemConfig()

	const getTabs = () => {
		let tabs = []
		Object.keys( contentTypes ).map( key => {

			const type = contentTypes[key]
			tabs.push( {
				handle: key,
				path: '/fl-content/tab/' + key,
				label: type.labels.plural,
				component: () => <PostTypeTab type={ key } />,
			} )
		} )

		return tabs
	}

	const Header = () => {
		return (
			<Nav.Tabs tabs={ tabs } shouldHandleOverflow={ true } />
		)
	}

	/* Ready to Remove Create Button?
	const Actions = () => {
		const to = {
			pathname: '/fl-content/post/new',
			state: {
				detailBaseUrl: '/fl-content/post'
			}
		}
		return (
			<>
				<Button to={ to } title={ __( 'Create New' ) }>
					<Icon.Plus />
				</Button>
			</>
		)
	}*/

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
			<Nav.CurrentTab tabs={ tabs } />
		</Page>
	)
}

export default Content
