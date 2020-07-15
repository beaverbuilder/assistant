import React from 'react'
import c from 'classnames'
import Box from '../box'
import { getHeightForRatio } from '../../utils'
import './style.scss'

const AspectBox = ( {
	children,
	className,
	ratio = 'square',
	style,
	width,
	height,
	...rest
} ) => {
	return (
		<Box
			padY={ false }
			padX={ false }
			className={ c( 'fluid-aspect-box', className ) }
			style={ {
				...style,
				paddingTop: getHeightForRatio( ratio, width, height ),
			} }
			{ ...rest }
		>
			<div>{children}</div>
		</Box>
	)
}

export default AspectBox
