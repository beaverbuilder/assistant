import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import { Page, Nav, Icon, Button } from 'assistant/ui'
import { SummaryTab, PostTypeTab } from './tabs'

export const Content = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}` } component={ Main } />
		<Nav.Route path={ `${match.url}/tab/:tab` } component={ Main } />
		<Nav.Route path={ `${match.url}/post/new` } component={ Page.CreatePost } />
		<Nav.Route path={ `${match.url}/post/:id` } component={ Page.Post } />
	</Nav.Switch>
)

const Main = () => {
	const { contentTypes } = getSystemConfig()

	const getTabs = () => {
		let tabs = [
			{
				handle: 'summary',
				label: __( 'Summary' ),
				path: '/fl-content/',
				component: SummaryTab,
				exact: true,
			}
		]
		Object.keys( contentTypes ).map( key => {
			const type = contentTypes[key]
			tabs.push( {
				handle: key,
				path: '/fl-content/tab/' + key,
				label: type.labels.singular,
				component: () => <PostTypeTab type={ key } />,
			} )
		} )
		return tabs
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

	return (
		<Page
			shouldPadSides={ false }
			header={ <Nav.Tabs tabs={ tabs } /> }
			headerActions={ <Actions /> }
		>
			<Nav.CurrentTab tabs={ tabs } />
		</Page>
	)
}

Content.Icon = () => {
	return (
		<svg width="34px" height="38px" viewBox="0 0 34 38" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g transform="translate(-8.000000, -6.000000)" fill="currentColor" fillRule="nonzero" stroke="currentColor" strokeWidth="0.5">
				<path d="M28.448844,7 C29.1377962,7 29.798264,7.27018052 30.283717,7.75059977 L40.2490144,17.6125647 C40.7300433,18.0886057 41,18.7322641 41,19.4031414 L41,37.2823529 C41,40.4401222 38.3951113,43 35.1818182,43 L14.8181818,43 C11.6048887,43 9,40.4401222 9,37.2823529 L9,12.7176471 C9,9.55987778 11.6048887,7 14.8181818,7 L28,7 L28.448844,7 Z M28,8.27 L14.8181818,8.27058824 C12.3189539,8.27058824 10.2929293,10.2616043 10.2929293,12.7176471 L10.2929293,37.2823529 C10.2929293,39.7383957 12.3189539,41.7294118 14.8181818,41.7294118 L35.1818182,41.7294118 C37.6810461,41.7294118 39.7070707,39.7383957 39.7070707,37.2823529 L39.7070707,19.4031414 C39.7070707,19.2650196 39.6841851,19.1292053 39.6404694,19.0005994 L30.7000001,19 C29.2088312,19 28,17.7911688 28,16.2999999 L28,8.27 Z"></path>
			</g>
		</svg>
	)
}
