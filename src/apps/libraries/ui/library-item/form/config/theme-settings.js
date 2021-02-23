import { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
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

	actions.push( {
		label: __( 'Import' ),
		onClick: importThemeSettings,
		disabled: importing,
	} )

	return actions
}
