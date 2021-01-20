import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { getSystemActions, useSystemState } from 'assistant/data'
import { Env } from 'assistant/ui'
import { useEdgeInsets } from './utils'

const getHeight = insets => `calc( 100vh - ${ insets.top + insets.bottom }px )`
const getWidth = isAppHidden => isAppHidden ? 60 : 420
const getBoxShadow = ( isHidden, isAppHidden ) => {
	if ( isHidden || isAppHidden ) {
		return '0 0 0px hsla( 210, 0%, 0%, 0 )'
	} else {
		return '0 0 20px hsla( 210, 30%, 50%, .5 )'
	}
}
const getLeft = ( originX = 0, width, insets ) => {
	return originX ? `calc( 100vw - ${ width + insets.left }px )` : insets.left
}

const isRightEdge = x => x >= ( window.innerWidth / 2 )

/**
 * Primary Frame Component
 */
const Frame = ( { children, ...rest } ) => {
	const [ dragArea, setDragArea ] = useState( false )
	const animation = useAnimation()
	const { setWindow } = getSystemActions()
	const { window: windowFrame, isAppHidden } = useSystemState( [ 'window', 'isAppHidden' ] )
	const { isHidden } = windowFrame
	const [ originX ] = windowFrame.origin
	const isBeaverBuilder = 'beaver-builder' === Env.use().application

	// An object describing how far from each edge of the window to place the frame against.
	const insets = useEdgeInsets()

	const setEdge = edge => {
		let newOrigin = [ ...windowFrame.origin ]
		newOrigin[0] = 'right' === edge ? 1 : 0
		setWindow( { ...windowFrame, origin: newOrigin } )
	}

	// Handle insets changing when admin bar changes height
	useEffect( () => {
		animation.set( {
			top: insets.top,
			height: getHeight( insets )
		} )
	}, [ insets ] )

	// Handle originX (left or right edge) change.
	useEffect( () => {
		const width = getWidth( isAppHidden )
		animation.start( {
			x: 0,
			y: 0,
			top: insets.top,
			left: getLeft( originX, width, insets )
		} )
	}, [ originX ] )

	// Handles isAppHidden changing in system state
	useEffect( () => {
		const width = getWidth( isAppHidden )
		animation.start( {
			width,
			left: getLeft( originX, width, insets ),
		} )
	}, [ isAppHidden ] )

	useEffect( () => {
		const width = getWidth( isAppHidden )
		const distance = originX ? width : -Math.abs( width )
		animation.start( {
			x: isHidden ? distance : 0,
			boxShadow: getBoxShadow( isHidden, isAppHidden )
		} )
	}, [ isHidden ] )

	// Setup initial
	const width = getWidth( isAppHidden )
	const distance = originX ? width : -Math.abs( width )

	return (
		<>
			{ false !== dragArea && <DropIndicator left={ getLeft( dragArea, 60, insets ) } /> }
			<motion.div

				// Initial animatable styles
				initial={ {
					x: isHidden ? distance : 0,
					top: insets.top,
					left: originX ? `calc( 100vw - ${ getWidth( isAppHidden ) + insets.left }px )` : insets.left,
					width: getWidth( isAppHidden ),
					height: getHeight( insets ),
					boxShadow: getBoxShadow( isHidden, isAppHidden ),
				} }

				// Attaches the animation controls object
				animate={ animation }
				transition={ { duration: .25 } }

				// Non-animating stuff
				style={ {
					position: 'fixed',
					overflow: 'hidden',
					boxSizing: 'border-box',
					background: 'var(--fluid-background)',
					zIndex: 9999,
					display: 'flex',
					flexDirection: 'column',
				} }

				drag
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

					// Pins itself to whichever side of the screen you drop the mouse in
					const newOriginX = isRightEdge( info.point.x ) ? 1 : 0

					if ( originX !== newOriginX ) {
						setEdge( newOriginX ? 'right' : 'left' )
					} else {

						// Snap back - no render required
						animation.start( { x: 0, y: 0 } )
					}
				} }
				{ ...rest }
			>
				{ ! isBeaverBuilder && <GrabBar /> }
				{children}
			</motion.div>
		</>
	)
}

const GrabBar = ( { ...rest } ) => {
	const styles = {
		display: 'flex',
		paddingTop: 4,
		paddingBottom: 10,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 5,
		cursor: 'move',
	}
	return (
		<div className="fl-asst-window-grab-bar" style={ styles } { ...rest }>
			<svg width="40" height="4" viewBox="0 0 40 4" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M2,2 L38,2"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
				/>
			</svg>
		</div>
	)
}

const DropIndicator = ( { left, ...rest } ) => {
	return (
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
}

export default Frame
