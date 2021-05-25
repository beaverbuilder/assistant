import React, { useState } from 'react'
import Lightbox from '../base'

export const useLightbox = ( options ) => {
	const [ isShowing, setIsShowing ] = useState( false )

	const showLightbox = () => {
		setIsShowing( true )
	}

	const LightboxComponent = () => {
		return (
			<Lightbox
				isShowing={ isShowing }
				setIsShowing={ setIsShowing }
				{ ...options }
			/>
		)
	}

	return [ showLightbox, LightboxComponent ]
}
