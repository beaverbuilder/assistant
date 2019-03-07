import { useState } from 'react'

export const useFileDrop = ( handleDrop = () => {} ) => {
	const [ isDragging, setIsDragging ] = useState( false )

	const onDragEnter = e => {
		e.preventDefault()
		e.stopPropagation()

		if ( e.dataTransfer.items && 0 < e.dataTransfer.items.length ) {
			setIsDragging( true )
		}
	}

	const onDragLeave = e => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging( false )
	}

	const onDragOver = e => {

		// Yea, it's necessary to prevent browser opening file
		e.preventDefault()
		e.stopPropagation()
	}

	const onDrop = e => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging( false )

		if ( e.dataTransfer.files && 0 < e.dataTransfer.files.length ) {
			handleDrop( e.dataTransfer.files )
			e.dataTransfer.clearData()
		}
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
