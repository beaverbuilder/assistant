import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useDragControls, useMotionValue, useTransform } from 'framer-motion'
import useMedia from 'use-media'
import c from 'classnames'
import { Frame as _Frame } from '@beaverbuilder/fluid'
import { Env } from 'assistant/ui'
import { getSystemActions, useSystemState, getSystemConfig } from 'assistant/data'
import {
	useEdgeInsets,
	getLeft,
	getRect,
	getBoxShadow,
	isRightEdge
} from './utils'
import './style.scss'

/**
 * Primary Frame Component
 */
const Frame = ( { children, isHidden = false, className, ...rest } ) => {

	/**
	 * System Store
	 */
	const { window: windowFrame, isAppHidden } = useSystemState( [ 'window', 'isAppHidden' ] )
	const { width: openWidth = defaultWidth, origin } = windowFrame
	const [ originX ] = origin
	const { setWindow } = getSystemActions()

	// System Defaults
	const { minWidth, maxWidth, defaultWidth, breakpoint } = getSystemConfig().frameDefaults

	/**
	 * Convenience function for setting the resized frame width in system store.
	 * This only saves the data - it does not cause a visual change to the frame.
	 */
	const setOpenWidth = value => setWindow( { ...windowFrame, width: value } )

	// Convenience function for pinning the frame to the left or right edge in system store.
	const setEdge = ( edge = 'left' ) => {
		let origin = [ ...windowFrame.origin ]
		origin[0] = 'right' === edge ? 1 : 0
		setWindow( { ...windowFrame, origin } )
	}

	/**
	 * Env Context
	 */
	const isBeaverBuilder = 'beaver-builder' === Env.use().application

	/**
	 * This is a control object that lets us manage animations directly.
	 * See animate prop.
	 */
	const animation = useAnimation()

	/**
	 * Drag controls allow us to check which element is triggering the drag and reject
	 * the drag if needed.
	 */
	const drag = useDragControls()

	// Tracks whether a drop indicator should be showing and on which side.
	const [ dragArea, setDragArea ] = useState( false )

	/**
	 * Insets is an object describing how far from each edge the panel should "pin".
	 * For now this is only really handling the top distance.
	 * Ex: { top: 32, left: 0, bottom: 0, right: 0 }
	 */
	const insets = useEdgeInsets()
	const stringifiedInsets = JSON.stringify( insets )
	const { top, left, width, height } = getRect( originX, insets, isAppHidden, openWidth )
	const boxShadow = getBoxShadow( isHidden, isAppHidden )

	// Resize stuff
	const minResizableWidth = minWidth
	const maxResizableWidth = maxWidth > window.innerWidth ? window.innerWidth : maxWidth

	const x = useMotionValue( originX ? -Math.abs( openWidth ) : openWidth )
	const _width = useTransform( x, x => isAppHidden ? 60 : Math.abs( x ) )
	const _left = useTransform( _width, _width => {
		return originX ? `calc( 100% - ${ _width + insets.right }px )` : 0
	} )

	// How far to translate the frame to get it off the screen
	const distance = originX ? width : -Math.abs( width )

	// Below 600px the admin bar jumps to absolute positioning / starts scrolling with the page.
	const isMobile = useMedia( { maxWidth: 600 } )

	// Handle mount and unmount
	useEffect( () => {
		const html = document.documentElement
		html.classList.add( originX ? 'fl-asst-pinned-right' : 'fl-asst-pinned-left' )

		return () => {
			html.classList.remove( 'fl-asst-pinned-right', 'fl-asst-pinned-left' )
		}
	}, [] )

	// Handle originX (left or right edge) change.
	useEffect( () => {
		const html = document.documentElement

		if ( ! isHidden ) {
			animation.start( { x: 0, y: 0, left } )

			if ( originX ) {

				// Put the drag resizer in the correct place
				x.set( -Math.abs( openWidth ) )

				// General class for knowing where Assistant is (especially for Beaver builder)
				html.classList.replace( 'fl-asst-pinned-left', 'fl-asst-pinned-right' )
			} else {

				// Put the drag resizer in the correct place
				x.set( openWidth )

				// General class for knowing where Assistant is (especially for Beaver builder)
				html.classList.replace( 'fl-asst-pinned-right', 'fl-asst-pinned-left' )
			}

		} else {
			animation.set( { x: distance, left } )
		}
	}, [ originX ] )

	// Handle insets changing when admin bar changes height
	// Animation would be overkill here.
	useEffect( () => {
		animation.set( { top, height } )
	}, [ stringifiedInsets ] )

	// Handles isAppHidden changing in system state
	useEffect( () => {
		animation.start( { width, left, boxShadow } )
	}, [ isAppHidden ] )

	// Handles isHidden changes
	useEffect( () => {
		const distance = originX ? width : -Math.abs( width )

		animation.start( {
			x: isHidden ? distance : 0,
			boxShadow
		} ).then( () => {
			animation.set( {
				pointerEvents: isHidden ? 'none' : 'auto'
			} )
		} )

		const html = document.documentElement
		if ( isHidden ) {
			html.classList.remove( 'fl-asst-pinned-right', 'fl-asst-pinned-left' )
		} else {
			html.classList.add( originX ? 'fl-asst-pinned-right' : 'fl-asst-pinned-left' )
		}

	}, [ isHidden ] )

	// Handle external frame resize
	useEffect( () => {
		const currentWidth = Math.floor( _width.get() )
		if ( openWidth !== currentWidth ) {
			x.set( originX ? -Math.abs( openWidth ) : openWidth )
		}
	}, [ openWidth ] )

	// Prep vars
	const getSizeName = openWidth => openWidth >= breakpoint ? 'medium' : 'compact'
	const size = getSizeName( openWidth )
	const context = {
		size,
		isMedium: 'medium' === size,
		isCompact: 'compact' === size,
		isDragging: false === dragArea,
	}
	const classes = c( 'fl-asst-frame', { [`fluid-frame-size-${size}`]: size }, className )
	const shouldShowResizer = false === dragArea && ! isHidden && ! isAppHidden

	return (
		<_Frame.Context.Provider value={ context }>
			{ false !== dragArea && <DropIndicator left={ getLeft( dragArea, 60, insets ) } /> }
			<motion.div
				className={ classes }

				// Attaches the animation controls object
				animate={ animation }
				transition={ { duration: .2 } }

				// Initial animatable styles
				initial={ {
					x: isHidden ? distance : 0,
					top,
					left,
					width,
					height,
					boxShadow,
				} }

				// Non-animating stuff
				style={ {
					width: _width,
					left: _left,
					position: 'fixed',
					overflow: 'auto',
					boxSizing: 'border-box',
					background: 'var(--fluid-background)',
					zIndex: isMobile || isBeaverBuilder ? 999999 : 9999, /* we usually want to be under the admin bar menus */
					display: 'flex',
					flexDirection: 'column',
					pointerEvents: isHidden ? 'none' : null,
					contain: 'strict',
					willChange: 'transform'
				} }

				drag
				dragControls={ drag }
				onDragStart={ ( e, info ) => {
					if ( ! e.target.classList.contains( 'frame-drag-handle' ) ) {

						// Stop the drag
						// be sure to pass along the event & info or it gets angry
						drag.componentControls.forEach( entry => entry.stop( e, info ) )
					}
				} }
				onDrag={ ( e, info ) => {
					if ( isRightEdge( info.point.x ) ) {
						if ( 1 !== dragArea ) {
							setDragArea( 1 )
						}
					} else {
						if ( 0 !== dragArea ) {
							setDragArea( 0 )
						}
					}
				} }
				onDragEnd={ ( e, info ) => {
					setDragArea( false )

					if ( ! e.target.classList.contains( 'frame-drag-handle' ) ) {
						return
					}

					// Pins itself to whichever side of the screen you drop the mouse in
					const newOriginX = isRightEdge( info.point.x ) ? 1 : 0

					/**
					 * If we're on a different side of the screen than before, we want to trigger a render.
					 * Otherwise we want to snap back to our original position, no render needed.
					 */
					if ( originX !== newOriginX ) {
						setEdge( newOriginX ? 'right' : 'left' )
					} else {
						animation.start( { x: 0, y: 0 } )
					}
				} }
				{ ...rest }
			>
				<GrabBar />
				{children}
			</motion.div>
			{ shouldShowResizer && (
				<ResizeHandle
					x={ x }
					top={ top }
					pinnedRight={ originX }
					maxWidth={ maxResizableWidth }
					minWidth={ minResizableWidth }
					setWidth={ setOpenWidth }
					size={ size }
					getSizeName={ getSizeName }
				/>
			) }
		</_Frame.Context.Provider>
	)
}

const ResizeHandle = ( { x, top, pinnedRight, maxWidth, minWidth, setWidth, size, getSizeName } ) => {
	const lastWidth = useRef( x.get() )
	const lastSize = useRef( size )
	const buffer = 10

	return (
		<motion.div
			className="fl-asst-frame-resize-handle"
			drag="x"
			dragMomentum={ false }
			onDrag={ () => {
				let newWidth = parseInt( Math.abs( x.get() ) )

				// Throttle how many times this checks w/ the buffer value
				if ( newWidth > lastWidth.current + buffer || newWidth < lastWidth.current - buffer ) {

					// Has the size name changed?
					const maybeNewSize = getSizeName( newWidth )
					if ( maybeNewSize !== lastSize.current ) {

						setWidth( newWidth )
						lastSize.current = maybeNewSize
					}
					lastWidth.current = newWidth
				}
			} }
			onDragEnd={ () => {
				let newWidth = parseInt( Math.abs( x.get() ) )

				if ( maxWidth < newWidth ) {
					newWidth = maxWidth
				} else if ( minWidth > newWidth ) {
					newWidth = minWidth
				}
				setWidth( newWidth )
			} }
			dragElastic={ 0 }
			dragConstraints={ {
				left: pinnedRight ? -Math.abs( maxWidth ) : minWidth,
				right: pinnedRight ? -Math.abs( minWidth ) : maxWidth,
			} }
			style={ {
				x,
				width: 6,
				position: 'fixed',
				top,
				bottom: 0,
				left: pinnedRight ? 'auto' : 0,
				right: pinnedRight ? 0 : 'auto',
			} }
		/>
	)
}

const GrabBar = () => (
	<div
		className="frame-drag-handle"
		style={ {
			display: 'flex',
			justifyContent: 'center',
			paddingTop: 4,
			paddingBottom: 10,
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			zIndex: 5,
			cursor: 'move',
			color: 'var(--fluid-opaque-7)'
		} }
	>
		<svg width="40" height="4" viewBox="0 0 40 4" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<path d="M2,2 L38,2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
		</svg>
	</div>
)

const DropIndicator = ( { left, ...rest } ) => (
	<div
		style={ {
			position: 'fixed',
			top: 0,
			bottom: 0,
			left,
			width: 60,
			background: 'var(--fluid-blue)',
			zIndex: 9998 /* Just below the frame */
		} }
		{ ...rest }
	/>
)

export default Frame
