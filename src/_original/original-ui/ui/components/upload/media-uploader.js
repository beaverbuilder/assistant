import React, { useContext } from 'react'
import { clearCache } from 'shared-utils/cache'
import { restRequest } from 'shared-utils/wordpress'
import { registerStore, useStore, getStore, getDispatch } from 'shared-utils/store'
import {
	Branding,
	EmptyMessage,
	FileDropListener,
	Icon,
	Padding,
	UIContext
} from 'components'

registerStore( 'fl-media/uploader', {
	state: {
		current: 0,
		items: [],
	}
} )

export const MediaDropUploader = ( { children } ) => {
	const { current, items } = useStore( 'fl-media/uploader' )
	const { setCurrent, setItems } = getDispatch( 'fl-media/uploader' )
	const { presentNotification } = useContext( UIContext )

	const onFilesDropped = files => {
		const { current, items } = getStore( 'fl-media/uploader' ).getState()

		for ( let i = 0; i < files.length; i++ ) {
			items.push( files.item( i ) )
		}

		setItems( [ ...items ] )

		if ( ! current ) {
			clearCache( 'attachments' )
			uploadNextItem()
		}
	}

	const uploadNextItem = () => {
		const { current, items } = getStore( 'fl-media/uploader' ).getState()
		const file = items[ current ]
		const data = new FormData()

		if ( ! file ) {
			setItems( [] )
			setCurrent( 0 )
			return
		}

		setCurrent( current + 1 )
		data.append( 'file', file, file.name || file.type.replace( '/', '.' ) )

		restRequest( {
			method: 'POST',
			route: 'wp/v2/media/',
			data,
			onSuccess,
			onError,
		} )
	}

	const onSuccess = () => {
		const { current, items } = getStore( 'fl-media/uploader' ).getState()
		uploadNextItem()
		if ( current === items.length ) {
			presentNotification( 'Media upload complete!' )
		}
	}

	const onError = () => {
		uploadNextItem()
		presentNotification( 'Error uploading media file.', { appearance: 'error' } )
	}

	if ( current ) {
		return (
			<EmptyMessage className="fl-asst-file-uploading fl-asst-file-drop-dragging-view">
				<Padding bottom={150}>
					<Padding top={false} style={{ display: 'flex', justifyContent: 'center' }}>
						<Branding name="outline" />
					</Padding>
					<div className="fl-asst-file-uploading-text">
						<Icon name='small-spinner' /> Uploading { current } of { items.length }
					</div>
				</Padding>
			</EmptyMessage>
		)
	}

	return (
		<FileDropListener onDrop={ onFilesDropped }>
			{ children}
		</FileDropListener>
	)
}
