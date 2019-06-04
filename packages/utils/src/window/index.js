import { useState, useEffect } from 'fl-react'

export const useWindowSize = () => {
	const isClient = 'object' === typeof window

	const getSize = () => {
		return {
			width: isClient ? window.innerWidth : null,
			height: isClient ? window.innerHeight : null,
			clientWidth: isClient ? document.body.clientWidth : null,
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
