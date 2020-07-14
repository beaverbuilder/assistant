import React, { useState, createContext, useContext } from 'react'
import ContentBoundary from '../content-boundary'
import c from 'classnames'

// Can we handle dragging?
/*
const canDrag = () => {
    const div = document.createElement('div')
    return ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div )
}

// If it supports FileReader it also supports DataTransfer
const canReadFiles = () => 'FileReader' in window
*/

const stopEvents = e => {
    e.preventDefault()
    e.stopPropagation()
}

const HoverMessage = () => {
    return (
        <ContentBoundary>
            <h1>You're Hovering!</h1>
        </ContentBoundary>
    )
}

const DropAreaContext = createContext()

const DropArea = ({
    tag: Tag = 'div',
    children,
    className,
    ...rest
}) => {
    const [isHovering, setIsHovering] = useState(false)
    const [files, setFiles] = useState([])

    const context = {
        files
    }

    const classes = c( 'fluid-drop-area', {
        'is-hovering' : isHovering
    }, className )

    const startHover = e => {
        setIsHovering( true )
        e.preventDefault()
        e.stopPropagation()
    }
    const endHover = e => {
        setIsHovering( false )
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <DropAreaContext.Provider value={context}>
            <Tag
                className={ classes }
                {...rest}
                onDrag={stopEvents}
                onDragStart={stopEvents}
                onDragOver={startHover}
                onDragLeave={endHover}
                onDragEnter={startHover}
                onDragEnd={endHover}
                onDrop={ e => {
                    setFiles( Array.from( e.nativeEvent.dataTransfer.files ) )
                    setIsHovering( false )
                    e.preventDefault()
                    e.stopPropagation()
                }}
            >
                { isHovering ? <HoverMessage /> : children}
            </Tag>
        </DropAreaContext.Provider>
    )
}

DropArea.use = () => useContext( DropAreaContext )

export default DropArea
