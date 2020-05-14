import React from 'react'
import { __ } from '@wordpress/i18n'
import { Layout, Nav, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import LibraryItems from './library-items'
import LibrarySettings from './library-settings'

export default ( { match } ) => {
	const { id } = match.params
	const [ library ] = cloud.libraries.useOne( id )

	if ( ! library ) {
		return <Page.Loading />
	}

	const tabs = [
		{
			handle: 'items',
			label: __( 'Items' ),
			path: `/fl-cloud/libraries/${ id }`,
			component: () => <LibraryItems library={ library } />,
			exact: true,
		},
		{
			handle: 'settings',
			label: __( 'Settings' ),
			path: `/fl-cloud/libraries/${ id }/tab/settings`,
			component: () => <LibrarySettings library={ library } />,
		}
	]

	return (
		<Page
			title={ __( 'Library' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<Layout.Box
				padX={ false }
			>
				<Nav.Tabs tabs={ tabs } />
				<Nav.CurrentTab tabs={ tabs } />
			</Layout.Box>
		</Page>
	)
}
