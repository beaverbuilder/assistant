import React from 'react'
import { __ } from '@wordpress/i18n'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Icon, Layout } from 'assistant/ui'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { useSystemState } from 'assistant/data'
import { Selection } from '@beaverbuilder/fluid'

export default () => {
	const history = useHistory()
	const { cloudUser } = useSystemState()
	const { pathname } = useLocation()
	const { isReadOnly, library, items, showUpload, setShowUpload } = Libraries.LibraryContext.use()
	const basePath = `/libraries/${ library.id }`
	const userid = cloudUser.id
	const userHasPermission = userid === library.permissions.permissions_user_id
	const { isSelecting, setIsSelecting } = Selection.use()
	const hasItems = items && !! items.length

	if ( ! library.permissions.update && ! library.permissions.edit_items ) {
		if ( ! library.permissions.shared && ! userHasPermission ) {
			return null
		}
	}

	const goToUpload = () => {
		setShowUpload( ! showUpload )
		if ( pathname !== basePath ) {
			history.goBack()
		}
	}

	const goToSettings = () => {
		if ( pathname === basePath ) {
			history.push( `${ basePath }/settings` )
		}
	}

	return (
		<>
			{
				hasItems &&
				<Layout.Row align="right">
					<Button onClick={ () => setIsSelecting( true ) }>
						{ __( 'Select Items' ) }
					</Button>
				</Layout.Row>
			}
			{ ! isReadOnly && library.permissions.edit_items &&
				<Button
					appearance='transparent'
					isSelected={ showUpload && ! pathname.includes( '/settings' ) }
					title={ __( 'Add Items' ) }
					onClick={ goToUpload }
					style={ {
						marginLeft: 'auto'
					} }
				>
					<Icon.Plus />
				</Button>
			}
			{ ( library.permissions.update || library.permissions.shared || userHasPermission ) &&
				<Button
					appearance='transparent'
					isSelected={ pathname.includes( '/settings' ) }
					title={ __( 'Settings' ) }
					onClick={ goToSettings }
				>
					<Icon.Cog />
				</Button>
			}
		</>
	)
}
