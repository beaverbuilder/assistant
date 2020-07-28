import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'

export const useUploader = ( {
	onUpload,
} ) => {
	const [ queuedFiles, setQueuedFiles ] = useState( [] )
	const [ finishedFiles, setFinishedFiles ] = useState( [] )
	const [ uploading, setUploading ] = useState( false )

	useEffect( () => {
		if ( ! uploading ) {
			uploadNextFile()
		}
	}, [ queuedFiles ] )

	const handleDrop = ( files ) => {
		const droppedFiles = appendFileData( files )
		setQueuedFiles( queuedFiles.concat( droppedFiles ) )
	}

	const handleSelect = ( e ) => {
		const selectedFiles = appendFileData( Object.values( e.target.files ) )
		setQueuedFiles( queuedFiles.concat( selectedFiles ) )
	}

	const appendFileData = ( files ) => {
		return files.map( file => {
			file.uploading = false
			file.tempUrl = URL.createObjectURL( file )
			return file
		} )
	}

	const uploadNextFile = () => {
		const file = queuedFiles[ 0 ]

		if ( ! file ) {
			setUploading( false )
			return
		} else if ( ! uploading ) {
			setUploading( true )
		}

		queuedFiles[ 0 ].uploading = true
		setQueuedFiles( [ ...queuedFiles ] )

		if ( onUpload ) {
			onUpload( file ).then( () => {
				uploadComplete( file )
			} ).catch( error => {
				file.error = error
				uploadComplete( file )
			} )
		} else {
			uploadComplete( file )
		}
	}

	const uploadComplete = ( file ) => {
		queuedFiles.shift()
		setQueuedFiles( [ ...queuedFiles ] )

		file.uploading = false
		finishedFiles.unshift( file )
		setFinishedFiles( [ ...finishedFiles ] )
		uploadNextFile()
	}

	return {
		queuedFiles,
		finishedFiles,
		handleDrop,
		handleSelect
	}
}
