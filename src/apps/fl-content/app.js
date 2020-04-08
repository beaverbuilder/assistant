import React from 'react'
import { __ } from '@wordpress/i18n'
import { Redirect } from 'react-router-dom'
import { getSystemConfig } from 'assistant/data'
import { Page, Nav, Icon, Button } from 'assistant/ui'
import { PostTypeTab } from './tabs'
import AppIcon from './icon'
import './style.scss'

export const Content = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}` }>
			<Redirect to={ { pathname: `${match.url}/tab/post` } } />
		</Nav.Route>
		<Nav.Route path={ `${match.url}/tab/:tab` } component={ Main } />
		<Nav.Route path={ `${match.url}/post/new` } component={ Page.CreatePost } />
		<Nav.Route path={ `${match.url}/post/:id` } component={ Page.Post } />
	</Nav.Switch>
)

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
				showButton: type.builtin
			} )
		} )

		return tabs
	}

	const Header = () => {
		return (
			<div style={ { flex: '1 1 auto', display: 'flex', flexDirection: 'column', margin: '5px -5px 0' } }>
				<Nav.Tabs tabs={ tabs } />
			</div>
		)
	}

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
			title={ __( 'Content' ) }
			icon={ <AppIcon context="sidebar" /> }
			padY={ false }
			header={ <Header /> }
			topContentStyle={ { border: 'none' } }
			actions={ <Actions /> }
			shouldScroll={ false }
			shouldShowBackButton={ false }
			showAsRoot={ true }
			onLoad={ onLoad }
		>
			<Nav.CurrentTab tabs={ tabs } />
		</Page>
	)
}
