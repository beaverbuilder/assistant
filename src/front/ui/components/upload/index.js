import React, { Fragment, useContext, useState } from 'react'
import classname from 'classnames'
import { clearCache } from 'utils/cache'
import { restRequest } from 'utils/wordpress'
import { EmptyMessage, Icon, Padding, Branding, UIContext } from 'components'
import './style.scss'

export const useFileDrop = ( handleDrop = () => {} ) => {
	const [ isDragging, setIsDragging ] = useState( false )

	const onDragEnter = e => {
		e.preventDefault()
		e.stopPropagation()

		if ( e.dataTransfer.items ) {
			e.dataTransfer.effectAllowed = 'copy'
			setIsDragging( true )
		}
		return false
	}

	const onDragLeave = e => {
		e.preventDefault()
		e.stopPropagation()

		if ( e.target === e.currentTarget ) {
			setIsDragging( false )
		}
		return false
	}

	const onDragOver = e => {

		// Yea, it's necessary to prevent browser opening file
		e.preventDefault()
		e.stopPropagation()
	}

	const onDrop = e => {
		e.preventDefault()
		e.stopPropagation()

		if ( e.dataTransfer.files && 0 < e.dataTransfer.files.length ) {
			handleDrop( e.dataTransfer.files )
		}

		setIsDragging( false )
	}

	return {
		bind: {
			onDragEnter,
			onDragLeave,
			onDragOver,
			onDrop,
		},
		isDragging
	}
}

const DraggingView = () => {
	return (
		<EmptyMessage>
			<Padding bottom={150}>
				<Padding top={false} style={{ display: 'flex', justifyContent: 'center' }}>
					<Branding name="outline" />
				</Padding>
				<div>We can't upload stuff yet, but come back soon!</div>
			</Padding>
		</EmptyMessage>
	)
}

export const FileDropListener = props => {
	const {
		children,
		className,
		onDrop = () => {},
		draggingView = <DraggingView />
	} = props

	const onFilesDropped = files => {
		onDrop( files )
	}
	const { bind, isDragging } = useFileDrop( onFilesDropped )

	const classes = classname( {
		'fl-asst-file-drop': true,
		'fl-asst-file-drop-is-dragging': isDragging,
	}, className )

	const merged = {
		...props,
		...bind,
		className: classes,
	}

	return (
		<Fragment>
			<div {...merged}>
				<div className="fl-asst-file-drop-content-view">{children}</div>
				<div className="fl-asst-file-drop-dragging-view">{draggingView}</div>
			</div>
		</Fragment>
	)
}

export const FileDropUploader = ( { children } ) => {
	const [ uploading, setUploading ] = useState( false )
	const { presentNotification } = useContext( UIContext )

	const onSuccess = () => {
		setUploading( false )
		presentNotification( 'File successfully uploaded.' )
	}

	const onError = () => {
		setUploading( false )
		presentNotification( 'Error! File not uploaded.', { appearance: 'error' } )
	}

	const onFilesDropped = files => {
		setUploading( true )
		clearCache( 'attachments' )

		for ( let i = 0; i < files.length; i++ ) {
			const file = files.item( i )
			const data = new FormData()
			data.append( 'file', file, file.name || file.type.replace( '/', '.' ) )

			restRequest( {
				method: 'POST',
				route: 'wp/v2/media/',
				data,
				onSuccess,
				onError,
			} )
		}
	}

	if ( uploading ) {
		return (
			<div className='fl-asst-file-uploading'>
				<Icon name='small-spinner' />
			</div>
		)
	}

	return (
		<FileDropListener onDrop={ onFilesDropped }>
			{ children}
		</FileDropListener>
	)
}
