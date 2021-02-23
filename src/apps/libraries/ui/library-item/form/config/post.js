import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { getWpRest } from 'assistant/utils/wordpress'

export const getActions = ( item, actions ) => {
	const { createNotice } = Libraries.ItemContext.use()
	const [ importing, setImporting ] = useState( false )
	const [ previewing, setPreviewing ] = useState( false )
	const history = useHistory()
	const api = getWpRest().libraries()

	const importPost = () => {
		setImporting( true )
		api.importPost( item.id ).then( response => {
			setImporting( false )
			if ( response.data.error ) {
				createNotice( {
					status: 'error',
					content: __( 'Error importing content.' )
				} )
			} else {
				createNotice( {
					status: 'success',
					content: (
						<>
							{ __( 'Content imported!' ) }
							<a
								style={ {
									textDecoration: 'underline',
									marginLeft: 'var(--fluid-sm-space)'
								} }
								onClick={ () => {
									history.push( `/fl-content/post/${ response.data.id }`, {
										item: response.data
									} )
								} }
							>
								{ __( 'View content.' ) }
							</a>
						</>
					)
				} )
			}
		} )
	}

	const previewPost = () => {
		setPreviewing( true )
		api.previewPost( item.id ).then( response => {
			setPreviewing( false )
			window.open( response.data.url )
		} )
	}

	actions.push( {
		label: __( 'Import' ),
		onClick: importPost,
		disabled: importing,
	} )

	actions.push( {
		label: __( 'Preview' ),
		onClick: previewPost,
		disabled: previewing,
	} )

	return actions
}
