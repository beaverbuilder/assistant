import React, { useContext, createContext } from 'react'
import { __ } from '@wordpress/i18n'
import { Icon, Media } from 'assistant/ui'
import { useAppState, getAppActions } from 'assistant/data'
import { useAttachments } from 'assistant/utils/wordpress'

export const MediaAppContext = createContext( {} )

export const useMediaApp = () => useContext( MediaAppContext )

export const MediaAppProvider = ( { children } ) => {
	const { query, lastViewed, showUploader } = useAppState( 'fl-media' )
	const { setQuery, setLastViewed, setShowUploader } = getAppActions( 'fl-media' )
	const attachments = useAttachments( query )
	const { files, uploadFiles: _uploadFiles, current } = Media.useMediaUploads()

	const uploadFiles = files => {
		setQuery( { ...query } )
		_uploadFiles( files, () => {
			console.log( 'upload complete' )
			attachments.reloadItems()
		} )
	}

	const context = {

		// All the attachment REST info
		...attachments,

		// Current query
		query,
		setQuery,

		// Info about file uploads and the uploader UI
		uploads: files,
		uploadFiles,
		currentUpload: current,
		showUploader,
		setShowUploader,

		// ID of the last viewed attachment detail page
		lastViewed,
		setLastViewed,
	}

	return (
		<MediaAppContext.Provider value={ context }>
			{children}
		</MediaAppContext.Provider>
	)
}

export const attachmentTypes = {
	all: {
		label: __( 'Everything' ),
		icon: Icon.Placeholder
	},
	image: {
		label: __( 'Photos' ),
		icon: Icon.Placeholder
	},
	video: {
		label: __( 'Videos' ),
		icon: Icon.Video
	},
	audio: {
		label: __( 'Audio' ),
		icon: Icon.Audio
	},
	document: {
		label: __( 'Documents' ),
		icon: Icon.Document
	},
}
