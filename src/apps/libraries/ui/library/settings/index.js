import React from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Layout, Page } from 'assistant/ui'
import ImportLibrary from './import'

export default () => {
	const { library } = Libraries.LibraryContext.use()

	return (
		<>
			<Layout.Box padY={ false }>
				<Page.Section label={ __( 'Library Settings' ) } padY={ false }>
					<Libraries.LibrarySettingsForm />
				</Page.Section>
			</Layout.Box>

			<Layout.Box padY={ false }>
				<Page.Section label={ __( 'Library Collections' ) }>
					<Libraries.LibraryCollectionsForm />
				</Page.Section>
			</Layout.Box>

			<Layout.Box padY={ false }>
				<Page.Section label={ __( 'Import Library' ) }>
					<ImportLibrary />
				</Page.Section>
			</Layout.Box>

			{ library.permissions.delete &&
				<Layout.Box>
					<Page.Section label={ __( 'Danger Zone' ) }>
						<Layout.Headline>{ __( 'Delete This Library' ) }</Layout.Headline>
						<p style={ { margin: '0' } }>{ __( 'Once a library has been deleted, it is gone forever. Please be sure you want to delete this library.' ) }</p>
					</Page.Section>
					<Libraries.LibraryDeleteForm />
				</Layout.Box>
			}
		</>
	)
}
