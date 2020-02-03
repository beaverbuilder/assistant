import React from 'react'
import { http } from 'utils/wordpress'
import { Icon } from 'ui'
import { createStoreRegistry } from 'fluid/data'
import './style.scss'


export const {
	registerStore,
	useStore,
	getStore,
	getDispatch,
	getSelectors
} = createStoreRegistry()
import { FileDropListener } from './drop-listner'

registerStore( 'fl-media/uploader', {
	state: {
		current: 0,
		items: [],
	}
} )

export const MediaDropUploader = ( { children } ) => {

	const { current, items } = useStore( 'fl-media/uploader' )
	const { setCurrent, setItems } = getDispatch( 'fl-media/uploader' )

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

		http.post( 'wp/v2/media/', data ).then( () => {

			onSuccess()

		} ).catch( onError )
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
