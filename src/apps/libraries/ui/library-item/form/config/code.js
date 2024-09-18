import { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { getWpRest } from 'assistant/utils/wordpress'

export const getActions = ( item, actions ) => {
	const { createNotice } = Libraries.ItemContext.use()
	const [ importing, setImporting ] = useState( false )
	const wpRest = getWpRest()

	const importCode = () => {
		setImporting( true )
		wpRest.libraries().importItem( item ).then( response => {
			createNotice( {
				status: response.data.error ? 'error' : 'success',
				content: response.data.error ? response.data.error : __( 'Item imported!' )
			} )
		} ).catch( error => {
			createNotice( {
				status: 'error',
				content: error.response.data.message
			} )
		} ).finally( () => {
			setImporting( false )
		} )
	}

	actions.unshift( {
		label: __( 'Import' ),
		onClick: importCode,
		disabled: importing
	} )

	return actions
}
