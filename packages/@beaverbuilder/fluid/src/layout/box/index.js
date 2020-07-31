import React from 'react'
import classname from 'classnames'

const Box = ( {
	className,
	style,
	padX = true,
	padY = true,
	outset = false,
	tag: Tag = 'div',
	...rest
} ) => {

	const classes = classname( {
		'fluid-box': true,
		'fluid-pad-x': padX && ! outset,
		'fluid-pad-y': padY,
		'fluid-box-outset': outset,
	}, className )

	return (
		<Tag className={ classes } style={ style } { ...rest } />
	)
}

export default Box
