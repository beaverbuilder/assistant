import React, { createContext, createRef, useRef, useState, useLayoutEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import classname from 'classnames'
import './style.scss'

export const Scroller = props => {
	const { className, style: stylesProp } = props
	const [needsScrollbars, setNeedsScrollbars] = useState(false)

	const classes = classname( {
		'fl-asst-scroller': true,
		'fl-asst-scroller-is-scrollable' : needsScrollbars,
	}, className )

	const ref = useRef( null )
	const { height } = useResizeObserver( ref )

	console.log( height )

	const context = {
		ref,
	}

	const style = {
		...stylesProp,
	}

	const merged = {
		...props,
		className: classes,
		ref,
		style,
	}

	return (
		<Scroller.Context.Provider value={context}>
			<div {...merged} />
		</Scroller.Context.Provider>
	)
}

Scroller.Context = createContext( {
	ref: null,
} )
Scroller.Context.displayName = 'Scroller.Context'

export const useResizeObserver = ref => {
	const defaults = {
		ref: null,
		x: null,
		y: null,
		width: null,
		height: null,
		top: null,
		left: null,
		bottom: null,
		right: null,
	}
	const [ data, setData ] = useState( defaults )

	useLayoutEffect( () => {
		if ( 'undefined' !== typeof ref.current ) {
			let id = null
			const measure = entries => {
				const { contentRect: rect } = entries[0]
				id = requestAnimationFrame( () => {

					const data = {
						...defaults,
						width: rect.width,
						height: rect.height,
						x: rect.x,
						y: rect.y,
						top: rect.top,
						left: rect.left,
						bottom: rect.bottom,
						right: rect.bottom
					}
					setData( data )
				} )
			}

			const observer = new ResizeObserver( measure )
			observer.observe( ref.current )

			return () => {
				cancelAnimationFrame( id )
				observer.disconnect()
			}
		}
	}, [] )

	return data
}
