import { useState, useEffect } from 'react'

export const useWindowSize = () => {
	const isClient = 'object' === typeof window

	const getSize = () => {
		return {
			width: isClient ? window.innerWidth : undefined,
			height: isClient ? window.innerHeight : undefined,
		}
	}

	const [ windowSize, setWindowSize ] = useState( getSize() )

	function handleResize() {
		setWindowSize( getSize() )
	}

	useEffect( () => {
		if ( ! isClient ) {
			return false
		}

		window.addEventListener( 'resize', handleResize )
		return () => window.removeEventListener( 'resize', handleResize )
	}, [] )

	return windowSize
}
