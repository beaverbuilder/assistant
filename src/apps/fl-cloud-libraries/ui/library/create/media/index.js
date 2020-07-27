import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Text } from 'fluid'
import { Button, Layout } from 'assistant/ui'
import cloud from 'assistant/cloud'
import Uploads from './uploads'

export default () => {
	const { id } = useParams()
	const [ queuedFiles, setQueuedFiles ] = useState( [] )
	const [ finishedFiles, setFinishedFiles ] = useState( [] )
	const [ uploading, setUploading ] = useState( false )
	const inputRef = useRef()

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
			file.tempUrl = URL.createObjectURL( file )
			return file
		} )
	}

	const getFileError = ( file ) => {
		if ( ! file.type.startsWith( 'image/' ) ) {
			return __( 'Unsupported file type' )
		} else if ( file.size > 64000000 ) {
			return __( 'Exceeds max size of 64MB' )
		}
		return null
	}

	const uploadNextFile = () => {
		const file = queuedFiles[ 0 ]

		if ( ! file ) {
			setUploading( false )
			return
		} else if ( ! uploading ) {
			setUploading( true )
		}

		const error = getFileError( file )

		if ( error ) {
			file.error = error
			uploadComplete( file )
			return
		}

		if ( 'image/svg+xml' === file.type ) {
			uploadSVG( file )
		} else {
			uploadImage( file )
		}
	}

	const uploadImage = ( file ) => {
		const data = new FormData()
		data.append( 'type', 'image' )
		data.append( 'name', file.name )
		data.append( 'media', file )

		cloud.libraries.createItem( id, data ).then( response => {
			uploadComplete( file )
		} ).catch( error => {
			file.error = error.response.data.message
			uploadComplete( file )
		} )
	}

	const uploadSVG = ( file ) => {
		const reader = new FileReader()
		const data = {
			type: 'svg',
			name: file.name
		}

		reader.onerror = () => {
			file.error = __( 'Error reading file' )
			uploadComplete( file )
		}

		reader.onload = e => {
			data.data = { xml: e.target.result }
			return cloud.libraries.createItem( id, data ).then( () => {
				uploadComplete( file )
			} ).catch( error => {
				file.error = error.response.data.message
				uploadComplete( file )
			} )
		}

		reader.readAsText( file )
	}

	const uploadComplete = ( file ) => {
		queuedFiles.shift()
		setQueuedFiles( [ ...queuedFiles ] )
		finishedFiles.unshift( file )
		setFinishedFiles( [ ...finishedFiles ] )
		uploadNextFile()
	}

	return (
		<Layout.DropArea onDrop={ handleDrop }>
			<Layout.Box
				style={ {
					height: '100%'
				} }
			>
				<Layout.Headline
					style={ {
						paddingBottom: 'var(--fluid-med-space)'
					} }
				>
					{ __( 'Add Media' ) }
				</Layout.Headline>

				<Layout.Box
					style={ {
						border: '2px dashed var(--fluid-line-color)',
						textAlign: 'center',
						justifyContent: 'center',
						height: queuedFiles.length || finishedFiles.length ? 'auto' : '100%'
					} }
				>
					<div
						style={ {
							paddingBottom: 'var(--fluid-lg-space)'
						} }
					>
						{ __( 'Drop to upload or select files' ) }
					</div>
					<input
						type='file'
						onChange={ handleSelect }
						ref={ inputRef }
						multiple={ true }
						accept='image/*,.svg'
						style={ {
							display: 'none'
						} }
					/>
					<Button onClick={ () => inputRef.current.click() }>
						{ __( 'Select Files' ) }
					</Button>
				</Layout.Box>

				{ !! queuedFiles.length &&
					<Layout.Box padX={ false }>
						<Uploads files={ queuedFiles } isLoading={ true } />
					</Layout.Box>
				}

				{ !! finishedFiles.length &&
					<Layout.Box padX={ false }>
						<Text.Title>
							{ __( 'Finished Files' ) }
						</Text.Title>
						<Uploads files={ finishedFiles } />
					</Layout.Box>
				}
			</Layout.Box>
		</Layout.DropArea>
	)
}
