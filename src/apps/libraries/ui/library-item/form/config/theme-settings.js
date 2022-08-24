import { useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'

export const getActions = ( item, actions ) => {
	const { adminURLs, themeSlug, themeParentSlug } = getSystemConfig()
	const { createNotice } = Libraries.ItemContext.use()
	const [ importing, setImporting ] = useState( false )
	const api = getWpRest().libraries()

	const maybeShowThemeWarning = () => {
		const { name, slug, parent } = item.data.theme

		if ( parent && ( parent.slug === themeSlug || parent.slug === themeParentSlug ) ) {
			return false
		} else if ( slug === themeSlug || slug === themeParentSlug ) {
			return false
		}

		if ( parent ) {
			alert( sprintf( __( 'The themes "%s" or "%s" must be active to apply or preview these settings.' ), parent.name, name ) )
		} else {
			alert( sprintf( __( 'The theme "%s" must be active to apply or preview these settings.' ), name ) )
		}

		return true
	}

	const importThemeSettings = () => {
		if ( maybeShowThemeWarning() ) {
			return
		} else if ( ! confirm( __( 'Do you really want to import these theme settings? This will update your site design and cannot be undone.' ) ) ) {
			return
		}
		setImporting( true )
		api.importThemeSettings( item.id ).then( response => {
			setImporting( false )
			if ( response.data.data.error ) {
				createNotice( {
					status: 'error',
					content: response.data.data.error,
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
		if ( ! maybeShowThemeWarning() ) {
			window.open( `${ adminURLs.customizeBase }?fl-asst-customizer-preview-init=${ item.id }` )
		}
	}

	actions.unshift( {
		label: __( 'Apply to Theme' ),
		onClick: importThemeSettings,
		disabled: importing,
	} )

	actions.unshift( {
		label: __( 'Preview' ),
		onClick: previewThemeSettings,
	} )

	return actions
}
