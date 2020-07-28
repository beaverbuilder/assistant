import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import cloud from 'cloud'
import { useUploader } from './base'

export const useLibrary = ( id ) => {

	const getFileError = ( file ) => {
		if ( ! file.type.startsWith( 'image/' ) ) {
			return __( 'Unsupported file type' )
		} else if ( file.size > 64000000 ) {
			return __( 'Exceeds max size of 64MB' )
		}
		return null
	}

	const uploadImage = ( file, resolve, reject ) => {
		const data = new FormData()
		data.append( 'type', 'image' )
		data.append( 'name', file.name )
		data.append( 'media', file )

		cloud.libraries.createItem( id, data ).then( () => {
			resolve()
		} ).catch( error => {
			reject( error.response.data.message )
		} )
	}

	const uploadSVG = ( file, resolve, reject ) => {
		const reader = new FileReader()
		const data = {
			type: 'svg',
			name: file.name
		}

		reader.onerror = () => {
			reject( __( 'Error reading file' ) )
		}

		reader.onload = e => {
			data.data = { xml: e.target.result }
			cloud.libraries.createItem( id, data ).then( () => {
				resolve()
			} ).catch( error => {
				reject( error.response.data.message )
			} )
		}

		reader.readAsText( file )
	}

	const onUpload = ( file ) => {
		return new Promise( ( resolve, reject ) => {
			const error = getFileError( file )
			if ( error ) {
				reject( error )
			} else if ( 'image/svg+xml' === file.type ) {
				uploadSVG( file, resolve, reject )
			} else {
				uploadImage( file, resolve, reject )
			}
		} )
	}

	return useUploader( { onUpload } )
}
