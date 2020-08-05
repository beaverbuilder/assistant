import React from 'react'
import c from 'classnames'

const sizes = [ 'lg', 'med', 'sm' ]

const Toolbar = ( {
	className,
	size = 'lg',
	isSticky = true,
	tag: Tag = 'div',
	...rest
} ) => (
	<Tag
		className={ c( 'fluid-toolbar', {
			[`fluid-size-${size}`]: sizes.includes( size ),
			'fluid-is-sticky': isSticky
		}, className ) }
		{ ...rest }
	/>
)

export default Toolbar
