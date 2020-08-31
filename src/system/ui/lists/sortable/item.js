import React, { useState, useRef } from 'react'
import c from 'classnames'
import { motion } from 'framer-motion'
import useMeasurePosition from './use-measure-position'

const defaultTransition = {
	layoutX: { duration: 0 },
	layoutY: {},
}

const SortableItem = ( {
	i,
	wrap,
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
	const lastY = useRef( 0 )

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
			dragConstraints={ wrap }
			dragElastic={ 0.1 }
			onDragStart={ () => {
				onSortStart()
				setDragging( true )
			} }
			onDragEnd={ () => {
				setDragging( false )
				onSortEnd()
			} }
			onViewportBoxUpdate={ ( vBox, delta ) => {
				const y = delta.y.translate
				const buffer = 10

				// Need to be the dragging element AND at least buffer more or less than lastY
				if ( isDragging && ( y >= lastY.current + buffer || y <= lastY.current - buffer ) ) {
					updateOrder( i, y )
					lastY.current = y
				}
			} }
			transition={ transition }
			{ ...rest }
		>
			{children}
		</motion.li>
	)
}

export default SortableItem
