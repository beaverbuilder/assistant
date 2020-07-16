import React, { useState, createContext, useContext } from 'react'
import c from 'classnames'
import { __ } from '@wordpress/i18n'
import { motion } from 'framer-motion'

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

const HoverScreen = ( { children } ) => {
	return (
		<motion.div
			initial={ { scale: .8 } }
			animate={ { scale: 1 } }
			style={ {
				background: 'var(--fluid-box-background)',
				border: '2px solid var(--fluid-line-color)',
				flex: '1 1 auto',
				pointerEvents: 'none',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			} }
		>
			{children}
		</motion.div>
	)
}

const DropAreaContext = createContext()

const DropArea = ( {
	tag: Tag = 'div',
	children,
	className,
	onDrop = () => {},
	hoverMessage = <h1>{__( 'You\'re Hovering...' )}</h1>,
	...rest
} ) => {
	const [ isHovering, setIsHovering ] = useState( false )
	const [ files, setFiles ] = useState( [] )
	const removeFile = name => setFiles( files.filter( file => file.name !== name ) )

	const context = {
		files,
		setFiles,
		removeFile,
	}

	const classes = c( 'fluid-drop-area', {
		'is-hovering': isHovering
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
		<DropAreaContext.Provider value={ context }>
			<Tag
				className={ classes }
				{ ...rest }
				onDrag={ stopEvents }
				onDragStart={ stopEvents }
				onDragOver={ startHover }
				onDragLeave={ endHover }
				onDragEnter={ startHover }
				onDragEnd={ endHover }
				onDrop={ e => {
					const files = Array.from( e.nativeEvent.dataTransfer.files )
					setFiles( files )
					setIsHovering( false )

					if ( 0 < files.length ) {
						onDrop( files, removeFile )
					}

					e.preventDefault()
					e.stopPropagation()
				} }
			>
				{ isHovering ? <HoverScreen>{hoverMessage}</HoverScreen> : children}
			</Tag>
		</DropAreaContext.Provider>
	)
}

DropArea.use = () => useContext( DropAreaContext )

export default DropArea
