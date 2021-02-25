import React from 'react'
import c from 'classnames'
import './style.scss'

const MediaShell = ( { children, className, ...rest } ) => {
	return (
		<div
			className={ c( 'fl-asst-media-app-shell', className ) }
			{ ...rest }
		>
			{children}
		</div>
	)
}

export default MediaShell
