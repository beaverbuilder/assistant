import { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'

export const getActions = ( item, actions ) => {
	const { createNotice } = Libraries.ItemContext.use()
	const [ importing, setImporting ] = useState( false )
	const api = getWpRest().libraries()

	const importThemeSettings = () => {
		if ( ! confirm( __( 'Do you really want to import these theme settings? This will update your site design and cannot be undone.' ) ) ) {
			return
		}
		setImporting( true )
		api.importItem( item ).then( response => {
			setImporting( false )
			if ( response.data.error ) {
				createNotice( {
					status: 'error',
					content: response.data.error,
					shouldDismiss: false
				} )
			} else {
				createNotice( {
					status: 'success',
					content: __( 'Settings imported!' )
				} )
				window.location.reload()
			}
		} )
	}

	const previewThemeSettings = () => {
		const { adminURLs } = getSystemConfig()
		window.open( `${ adminURLs.customizeBase }?fl-asst-customizer-preview-init=${ item.id }` )
	}

	actions.push( {
		label: __( 'Apply to Theme' ),
		onClick: importThemeSettings,
		disabled: importing,
	} )

	actions.push( {
		label: __( 'Preview' ),
		onClick: previewThemeSettings,
	} )

	return actions
}
