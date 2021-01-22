import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import b from '@beaverbuilder/box'
import useMedia from 'use-media'
import { Env } from 'assistant/ui'
import { getSystemActions, useSystemState } from 'assistant/data'
import {
	useEdgeInsets,
	getLeft,
	getRect,
	getBoxShadow,
	isRightEdge
} from './utils'

/**
 * Primary Frame Component
 */
const Frame = ( { children, isHidden = false, ...rest } ) => {
	const { setWindow } = getSystemActions()
	const { window: windowFrame, isAppHidden } = useSystemState( [ 'window', 'isAppHidden' ] )
	const [ originX ] = windowFrame.origin
	const { application } = Env.use()
	const isBeaverBuilder = 'beaver-builder' === application

	/**
	 * This is a control object that let's us manage animations directly.
	 * See animate prop.
	 */
	const animation = useAnimation()

	// Tracks whether a drop indicator should be showing and on which side.
	const [ dragArea, setDragArea ] = useState( false )

	/**
	 * Insets is an object describing how far from each edge the panel should "pin".
	 * For now this is only really handling the top distance.
	 * Ex: { top: 32, left: 0, bottom: 0, right: 0 }
	 */
	const insets = useEdgeInsets()
	const { top, left, width, height } = getRect( originX, insets, isAppHidden )
	const boxShadow = getBoxShadow( isHidden, isAppHidden )

	// How far to translate the frame to get it off the screen
	const distance = originX ? width : -Math.abs( width )

	// Below 600px the admin bar jumps to absolute positioning / starts scrolling with the page.
	const isMobile = useMedia( { maxWidth: 600 } )

	// Handle insets changing when admin bar changes height
	useEffect( () => {

		// Animation would be overkill here.
		animation.set( { top, height } )
	}, [ insets ] )

	// Handle originX (left or right edge) change.
	useEffect( () => {
		if ( ! isHidden ) {
			animation.start( { x: 0, y: 0, left } )
		} else {
			animation.set( { x: distance, left } )
		}
	}, [ originX ] )

	// Handles isAppHidden changing in system state
	useEffect( () => {
		animation.start( { width, left, boxShadow } )
	}, [ isAppHidden ] )

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
	}, [ isHidden ] )

	const setEdge = edge => {
		let newOrigin = [ ...windowFrame.origin ]
		newOrigin[0] = 'right' === edge ? 1 : 0
		setWindow( { ...windowFrame, origin: newOrigin } )
	}

	return (
		<>
			{ false !== dragArea && <DropIndicator left={ getLeft( dragArea, 60, insets ) } /> }
			<motion.div

				// Initial animatable styles
				initial={ {
					x: isHidden ? distance : 0,
					top,
					left,
					width,
					height,
					boxShadow,
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
					zIndex: isMobile || isBeaverBuilder ? 999999 : 9999, /* we usually want to be under the admin bar menus */
					display: 'flex',
					flexDirection: 'column',
					pointerEvents: isHidden ? 'none' : null,
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
		</>
	)
}

const GrabBar = () => (
	<b.row
		style={ {
			paddingTop: 4,
			paddingBottom: 10,
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			zIndex: 5,
			cursor: 'move',
		} }
	>
		<svg width="40" height="4" viewBox="0 0 40 4" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<path d="M2,2 L38,2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
		</svg>
	</b.row>
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
