import { useState } from 'react'
import { useStore } from 'store'
import { useWindowSize } from 'utils/window'

export const useAppFrame = () => {
	const { panelPosition, apps, activeApp } = useStore()
	const { width: windowWidth, height: windowHeight } = useWindowSize()
	const app = apps[ activeApp ]
	const [ sizeName, setSizeName ] = useState( app.size )

	const sizes = [ 'normal', 'wide', 'full' ]

	const setAppFrameSize = name => {

		if ( ! sizes.includes( name ) ) {
			return false
		}
		setSizeName( name )
	}

	const getSize = name => {
		let width = 440
		let height = windowHeight
		let size = name

		switch ( name ) {
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

	console.log( 'before', sizeName )
	const { width, height, size  } = getSize( sizeName )
	console.log( 'after', sizeName, size )

	//console.trace()

	return {
		appFrame: {
			width,
			height,
			sizeName,
			alignment: panelPosition,
		},
		setAppFrameSize,
	}
}
