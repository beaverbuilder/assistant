import React from 'react'
import { registerStore, getStore, getDispatch } from 'data/registry'
import { getWpRest } from 'utils/wordpress'
import './style.scss'
import { FileDropListener } from './drop-listener'

const Media = {}

registerStore( 'fl-media/uploader', {
	state: {
		current: 0,
		items: [],
	}
} )

export const Uploader = ( { children } ) => {

	const { setCurrent, setItems } = getDispatch( 'fl-media/uploader' )
	const wpRest = getWpRest()
	const onFilesDropped = files => {
		const { current, items } = getStore( 'fl-media/uploader' ).getState()

		for ( let i = 0; i < files.length; i++ ) {
			items.push( files.item( i ) )
		}

		setItems( [ ...items ] )

		if ( ! current ) {

			uploadNextItem()
		}
	}

	const uploadNextItem = () => {

		const { current, items } = getStore( 'fl-media/uploader' ).getState()
		const file = items[current]
		const data = new FormData()

		if ( ! file ) {
			setItems( [] )
			setCurrent( 0 )
			return
		}

		setCurrent( current + 1 )

		data.append( 'file', file, file.name || file.type.replace( '/', '.' ) )

		wpRest.attachments().create( data ).then( response => {
			onSuccess( response )
		} ).catch( ( error ) => {
			onError( error )
		} )
	}

	const onSuccess = () => {
		const { current, items } = getStore( 'fl-media/uploader' ).getState()
		uploadNextItem()
		if ( current === items.length ) {
			alert( 'Media upload complete!' )

		}
	}

	const onError = () => {
		uploadNextItem()
		alert( 'Error uploading media file.', { appearance: 'error' } )
	}

	return (
		<FileDropListener onDrop={ onFilesDropped }>
			{children}
		</FileDropListener>
	)
}

Media.Uploader = Uploader

export default Media
