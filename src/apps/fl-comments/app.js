import React from 'react'
import { Page, Nav } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import { AllTab, CommentTypeTab } from './tabs'
import { __ } from '@wordpress/i18n'
import './style.scss'


export const CommentsApp = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}/` } component={ Main } />
		<Nav.Route path={ `${match.url}/tab/:tab` } component={ Main } />
		<Nav.Route path={ `${match.url}/comment/:id` } component={ Page.Comment } />
	</Nav.Switch>
)

const Main = () => {

	const getTabs = () => {
		let tabs = [
			{
				handle: 'all',
				label: __( 'All' ),
				path: '/fl-comments',
				component: AllTab,
				exact: true,
			}
		]
		let tab = [

			{
				handle: 'hold',
				label: __( 'Pending ' ),
				path: '/fl-comments/',
			},
			{
				handle: 'approve',
				label: __( 'Approved' ),
				path: '/fl-comments/',
			},
			{
				handle: 'spam',
				label: __( 'Spam' ),
				path: '/fl-comments/',
			},
			{
				handle: 'trash',
				label: __( 'Trashed' ),
				path: '/fl-comments/',
			},

		]

		Object.keys( tab ).map( key => {
			const type = tab[key]

			tabs.push( {
				handle: type.handle,
				path: '/fl-comments/tab/' + type.handle,
				label: type.label,
				component: () => <CommentTypeTab type={ type.handle } label={ type.label } />,

			} )
		} )

		return tabs
	}
	const tabs = getTabs()

	const { pluginURL } = getSystemConfig()
	const hero = `${pluginURL}img/comment-hero-a.jpg`

	return (
		<Page
			id="fl-comments-list-page"
			padX={ false }
			padY={ false }
			title={ __( 'Comments' ) }
			header={ <Nav.Tabs tabs={ tabs } /> }
			hero={ hero }
			shouldScroll={ false }
		>
			<Nav.CurrentTab tabs={ tabs } />
		</Page>
	)
}

CommentsApp.Icon = ( { windowSize } ) => {
	const size = 'mini' === windowSize ? 33 : 42
	return (
		<svg width={ size } viewBox="0 0 33 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g transform="translate(-9.000000, -10.000000)" fill="currentColor" fillRule="nonzero" stroke="none">
				<path d="M17.7575684,41.328125 C16.9553223,41.328125 16.4709473,40.737793 16.4709473,39.8295898 L16.4709473,35.7426758 L15.5021973,35.7426758 C11.4001465,35.7426758 9.0690918,33.3813477 9.0690918,29.324707 L9.0690918,17.1547852 C9.0690918,13.0830078 11.4001465,10.7216797 15.5021973,10.7216797 L35.4978027,10.7216797 C39.5998535,10.7216797 41.9309082,13.0981445 41.9309082,17.1547852 L41.9309082,29.324707 C41.9309082,33.3662109 39.5998535,35.7426758 35.4978027,35.7426758 L24.7507324,35.7426758 L19.4226074,40.4199219 C18.7565918,41.0102539 18.3327637,41.328125 17.7575684,41.328125 Z M18.2268066,39.2089844 L23.2067871,34.4863281 C23.7062988,33.9868164 24.0544434,33.8808594 24.7507324,33.8808594 L35.482666,33.8808594 C38.4494629,33.8808594 40.0539551,32.2158203 40.0539551,29.3095703 L40.0539551,17.1699219 C40.0539551,14.2485352 38.4494629,12.5986328 35.482666,12.5986328 L15.517334,12.5986328 C12.5202637,12.5986328 10.9460449,14.2485352 10.9460449,17.1699219 L10.9460449,29.3095703 C10.9460449,32.2158203 12.5202637,33.8808594 15.517334,33.8808594 L17.2277832,33.8808594 C17.8483887,33.8808594 18.2268066,34.2592773 18.2268066,34.8798828 L18.2268066,39.2089844 Z" ></path>
			</g>
		</svg>
	)
}
