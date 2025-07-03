import React from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Layout, Page, Button } from 'assistant/ui'
import ImportLibrary from './import'
import DownloadZip from './download-zip'
import { useSystemState } from 'assistant/data'
import './style.scss'

export default () => {
	const { isReadOnly, library } = Libraries.LibraryContext.use()
	const { cloudUser } = useSystemState()
	const userid = cloudUser.id
	const userHasPermission = userid === library.permissions.permissions_user_id && ! library.permissions.owner
	const isShared = ( library.permissions.shared && ! library.permissions.owner ) || userHasPermission

	return (
		<>
			{ ! isReadOnly &&
				<>
					<Layout.Box padY={ false }>
						<Page.Section label={ __( 'Actions' ) }>
							<Button.Group appearance="grid">
								<ImportLibrary />
								<DownloadZip />
							</Button.Group>
						</Page.Section>
					</Layout.Box>
				</>
			}

			{ ! isShared &&
				<Layout.Box padY={ false } className='fl-asst-library-settings'>
					<Page.Section label={ __( 'Library Settings' ) } padY={ false }>
						<Libraries.LibrarySettingsForm />
					</Page.Section>
				</Layout.Box>
			}

			{ ! isReadOnly &&
				<>
					{ ! isShared &&
						<Layout.Box padY={ false }>
							<Page.Section label={ __( 'Library Collections' ) }>
								<Libraries.LibraryCollectionsForm />
							</Page.Section>
						</Layout.Box>
					}

					{ isShared && library.permissions.edit_collections &&
						<Layout.Box padY={ false }>
							<Page.Section label={ __( 'Library Collections' ) }>
								<Libraries.LibraryCollectionsForm />
							</Page.Section>
						</Layout.Box>
					}
				</>
			}

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
