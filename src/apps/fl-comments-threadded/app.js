import React from 'react'
import { App, Page, Nav } from 'assistant/ui'
import CommentTab from './tabs'
import AppIcon from './icon'
import { __ } from '@wordpress/i18n'
import './style.scss'

export default props => (
	<App.Config
		pages={ {
			default: Main,
			'tab/:tab': Main,
			'comment/:id': Page.Comment
		} }
		{ ...props }
	/>
)

export const defaultStatus = 'hold'

export const statuses = {
	all: __( 'All' ),
	hold: __( 'Pending ' ),
	approve: __( 'Approved' ),
	spam: __( 'Spam' ),
	trash: __( 'Trashed' ),
}

const Main = ( { baseURL, handle: appHandle, label } ) => {

	const tabs = Object.entries( statuses ).map( ( [ handle, label ] ) => {
		return {
			handle,
			label,
			exact: 'all' === handle,
			path: 'all' === handle ? baseURL : baseURL + '/tab/' + handle,
			component: () => (
				<CommentTab
					type={ handle }
					label={ label }
					appHandle={ appHandle }
					baseURL={ baseURL }
				/>
			)
		}
	} )

	return (
		<Page
			id="fl-comments-list-page"
			padX={ false }
			padY={ false }
			title={ label }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
			shouldScroll={ false }
			showAsRoot={ true }
		>
			<Nav.CurrentTab tabs={ tabs } />
		</Page>
	)
}
