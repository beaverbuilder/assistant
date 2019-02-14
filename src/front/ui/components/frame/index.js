import React, { useState, useEffect } from 'react'
import { useStore } from 'store'

export const useWindowSize = () => {
	const isClient = typeof window === 'object'

	const getSize = () => {
		return {
			width: isClient ? window.innerWidth : undefined,
			height: isClient ? window.innerHeight : undefined,
		}
	}

	const [windowSize, setWindowSize] = useState( getSize() )

	function handleResize() {
		setWindowSize( getSize() )
	}

	useEffect( () => {
		if ( ! isClient ) {
			return false
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [] )

	return windowSize
}

export const useAppFrame = () => {
    const { width: windowWidth, height: windowHeight } = useWindowSize()
	const [sizeName, setSizeName] = useState('normal')
    const { panelPosition } = useStore()

    const sizes = [ 'normal', 'wide', 'full' ]

    const setAppFrameSize = name => {

        if ( ! sizes.includes( name ) ) {
            console.error('Not a valid size name', name )
            return false
        }
        setSizeName( name )
    }

    const getSize = name => {
        let width = 440
        let height = windowHeight
        let preferredWidth = width
        let size = sizeName

        switch( name ) {
            case 'wide':
                width = 700
                if ( width > ( windowWidth * .8 ) ) {
                    width = windowWidth
                    size = 'full'
                }
                break

            case 'full':
                width = windowWidth
                height = windowHeight
                break

            default:
                if ( width > ( windowWidth * .6 ) ) {
                    width = windowWidth
                    size = 'full'
                }
                break
        }
        return { width, height, size }
    }

    const { width, height, size  } = getSize( sizeName )

	return {
        appFrame: {
            width,
            height,
            size,
            alignment: panelPosition,
        },
        setAppFrameSize,
    }
}
