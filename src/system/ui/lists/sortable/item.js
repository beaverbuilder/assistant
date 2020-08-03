import React, { useState } from 'react'
import c from 'classnames'
import { motion } from 'framer-motion'
import useMeasurePosition from './use-measure-position'

const defaultTransition = {
    duration: 0.25,
    ease: "easeInOut"
}

const SortableItem = ( {
	i,

	updatePosition = () => {},
	updateOrder = () => {},

	className,
	children,
	onSortStart,
	onSortEnd,
    transition = defaultTransition,

	...rest
} ) => {
	const [ isDragging, setDragging ] = useState( false )
	const ref = useMeasurePosition( pos => updatePosition( i, pos ) )
	const classes = c( { 'is-dragging': isDragging }, className )

	// Spring configs
	const onTop = {
		zIndex: 9,
		scale: 1.04,
	}
	const flat = {
		zIndex: 0,
		scale: 1,
	}

	return (
		<motion.li
            className={ classes }
			ref={ ref }
			layout
			initial={ false }
			animate={ isDragging ? onTop : flat }
			drag="y"
			dragConstraints={ { top: 0, bottom: 0 } }
			dragElastic={ 1 }
			onDragStart={ () => {
				onSortStart()
				setDragging( true )
			} }
			onDragEnd={ () => {
				setDragging( false )
				onSortEnd()
			} }
			onViewportBoxUpdate={ ( vBox, delta ) => isDragging && updateOrder( i, delta.y.translate ) }
            transition={transition}
			{ ...rest }
		>
			{children}
		</motion.li>
	)
}

export default SortableItem
