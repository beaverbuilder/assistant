import React, { createRef, createContext, useLayoutEffect, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import classname from 'classnames'
import './style.scss'

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
    size: 'normal',
}

export const FrameContext = createContext( defaults )
FrameContext.displayName = 'FrameContext'

export const Frame = props => {
    const { className } = props
    const [rect, setRect] = useState( defaults )
    const ref = createRef()

    useLayoutEffect( () => {
		if ( 'undefined' !== typeof ref.current ) {
			let id = null
			const measure = entries => {
                const { contentRect: rect } = entries[0]
				id = requestAnimationFrame( () => {
                    let size = 'normal'
                    if ( rect.width > 600 ) {
                        size = 'wide'
                    }

                    const data = {
                        ...defaults,
                        size,
                        width: rect.width,
                        height: rect.height,
                        x: rect.x,
                        y: rect.y,
                        top: rect.top,
                        left: rect.left,
                        bottom: rect.bottom,
                        right: rect.bottom
                    }
					setRect( data )
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

    const classes = classname({
        'fl-asst-frame' : true,
    }, className )

    const mergedProps = {
        ...props,
        ref,
        className: classes,
    }

    const context = {
        ref,
        ...rect
    }

    return (
        <FrameContext.Provider value={context}>
            <div {...mergedProps} />
        </FrameContext.Provider>
    )
}
