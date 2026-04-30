import React from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'

const copyToClipboard = async ( text ) => {
	try {
		await navigator.clipboard.writeText( text )
		return true
	} catch {
		const ta = document.createElement( 'textarea' )
		ta.value = text
		ta.setAttribute( 'readonly', '' )
		ta.style.position = 'absolute'
		ta.style.left = '-9999px'
		document.body.appendChild( ta )
		ta.select()
		try {
			return document.execCommand( 'copy' )
		} finally {
			document.body.removeChild( ta )
		}
	}
}

export default () => {
	const { library, createNotice } = Libraries.LibraryContext.use()
	const { cloudConfig } = getSystemConfig()
	const base = ( cloudConfig.appUrl || '' ).replace( /\/$/, '' )
	const url = `${ base }/community/library/${ library.id }`

	const handleClick = async () => {
		const ok = await copyToClipboard( url )
		if ( ok ) {
			createNotice( 'success', __( 'Public URL copied to clipboard.' ) )
		} else {
			createNotice( 'error', __( 'Could not copy URL.' ) )
		}
	}

	return (
		<Button
			title={ __( 'Copy the link to this library on Assistant Pro.' ) }
			onClick={ handleClick }
		>
			{ __( 'Copy Public URL' ) }
		</Button>
	)
}
