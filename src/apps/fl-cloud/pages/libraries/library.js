import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout, Nav, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import LibraryItems from './library-items'
import LibraryCollections from './library-collections'
import LibrarySettings from './library-settings'

export default ( { match } ) => {
	const { id } = match.params
	const [ library ] = cloud.libraries.useOne( id )

	if ( ! library ) {
		return <Page.Loading />
	}

	let tabs = [
		{
			handle: 'items',
			label: __( 'Items' ),
			path: `/fl-cloud/libraries/${ id }`,
			component: () => <LibraryItems library={ library } />,
			exact: true,
		},
		{
			handle: 'collections',
			label: __( 'Collections' ),
			path: `/fl-cloud/libraries/${ id }/tab/collections`,
			component: () => <LibraryCollections library={ library } />,
		},
	]

	if ( library.permissions.update ) {
		tabs.push( {
			handle: 'settings',
			label: __( 'Settings' ),
			path: `/fl-cloud/libraries/${ id }/tab/settings`,
			component: () => <LibrarySettings library={ library } />,
		} )
	}

	return (
		<Page
			title={ __( 'Library' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<Layout.Box
				padY={ false }
				style={ {
					flexDirection: 'row',
					alignItems: 'center',
					paddingTop: 'var(--fluid-sm-space)'
				} }
			>
				<div style={ { width: '100%' } }>
					<Layout.Headline>{ library.name }</Layout.Headline>
					{ library.description &&
						<div style={ { marginTop: 'var(--fluid-sm-space)' } }>
							{ library.description }
						</div>
					}
				</div>
				<Button
					to={ `/fl-cloud/libraries/${ library.id }/items/new` }
					style={ { marginLeft: '10px' } }
				>
					<Icon.Plus />
				</Button>
			</Layout.Box>
			<Layout.Box
				padX={ false }
			>
				<Nav.Tabs tabs={ tabs } />
				<Nav.CurrentTab tabs={ tabs } />
			</Layout.Box>
		</Page>
	)
}
