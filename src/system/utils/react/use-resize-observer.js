import { useState, useRef, useEffect } from 'react'

const useResizeObserver = () => {
	const ref = useRef()
	const [ size, setSize ] = useState( [ 0, 0 ] )

	useEffect( () => {

		if ( ! ref.current ) {
			return
		}

		const observer = new ResizeObserver( entries => {
			if ( ! Array.isArray( entries ) ) {
				return
			}

			let box = null
			for ( let entry of entries ) {
				if ( entry.borderBoxSize ) {
					box = Array.isArray( entry.borderBoxSize ) ? entry.borderBoxSize[ 0 ] : entry.borderBoxSize
				}
			}
			if ( box.inlineSize + box.blockSize !== size[0] + size[1] ) {
				setSize( [ box.inlineSize, box.blockSize ] )
			}
		} )

		observer.observe( ref.current )

		return () => observer.unobserve( ref.current )
	}, [] )

	return {
		ref,
		width: size[0],
		height: size[1]
	}
}

export default useResizeObserver
