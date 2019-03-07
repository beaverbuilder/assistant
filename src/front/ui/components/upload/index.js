import React, { useState } from 'react'

export const useFileDrop = ( handleDrop = () => {} ) => {
    const [ isDragging, setIsDragging ] = useState( false )

    const onDragEnter = e => {

        if ( e.dataTransfer.items && e.dataTransfer.items.length > 0 ) {
            setIsDragging( true )
        }
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragLeave = e => {

        setIsDragging( false )
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragOver = e => {
        // Yea, it's necessary
        e.preventDefault()
        e.stopPropagation()
    }

    const onDrop = e => {
        setIsDragging( false )

        if ( e.dataTransfer.files && e.dataTransfer.files.length > 0 ) {
            handleDrop( e.dataTransfer.files )
            e.dataTransfer.clearData()
        }
        e.preventDefault()
        e.stopPropagation()
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
