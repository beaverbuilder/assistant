import React from 'react'
import { Icon } from 'assistant/ui'
import { registerStore, useStore, getStore, getDispatch } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import './style.scss'
import { FileDropListener } from './drop-listner'

registerStore( 'fl-import/uploader', {
	state: {
		current: 0,
		items: [],
	}
} )

export const ImportDropUploader = ( { children } ) => {

	const { current, items } = useStore( 'fl-import/uploader' )
	const { setCurrent, setItems } = getDispatch( 'fl-import/uploader' )
	const wpRest = getWpRest()
	const onFilesDropped = files => {
		const { current, items } = getStore( 'fl-import/uploader' ).getState()

		for ( let i = 0; i < files.length; i++ ) {
			items.push( files.item( i ) )
		}

		setItems( [ ...items ] )

		if ( ! current ) {

			uploadNextItem()
		}
	}

	const uploadNextItem = () => {

		const { current, items } = getStore( 'fl-import/uploader' ).getState()
		const file = items[current]
		const data = new FormData()

		if ( ! file ) {
			setItems( [] )
			setCurrent( 0 )
			return
		}

		setCurrent( current + 1 )

		data.append( 'file', file, file.name || file.type.replace( '/', '.' ) )

		wpRest.posts().import( data ).then( response => {
			onSuccess( response )
		} ).catch( ( error ) => {
			onError( error )
		} )


	}


	const onSuccess = ( response ) => {
		uploadNextItem()
		if ( response ) {

			alert( response.data.message )
		}

	}

	const onError = () => {
		uploadNextItem()
		alert( 'Error uploading import file.', { appearance: 'error' } )
	}

	if ( current ) {
		return (

			<div className="fl-asst-file-uploading-text fl-asst-file-drop-file-wrapper">
				<Icon.SmallSpinner /> Uploading {current} of {items.length}
			</div>

		)
	}

	return (
		<FileDropListener onDrop={ onFilesDropped }>
			{children}
		</FileDropListener>
	)
}
