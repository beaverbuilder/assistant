import React, { useState, useRef, useEffect } from 'react'
import { getWidgetActions } from 'data'
import { motion } from 'framer-motion'
import c from 'classnames'
import Widget from '../'

// Spring configs
const onTop = {
	zIndex: 9,
	scale: 1.04,
}
const flat = {
	zIndex: 0,
	scale: 1,
}

const Item = ( {
	i,
	id,
	layoutHandle,
	size,
	type,
	title,
	settings,
	render: Content,

	wrap,
	className,
	setDimensions = () => {}, // track size/offset of each item
	updateOrder = () => {}, // request new position in array
	...rest
} ) => {
	const [ isDragging, setIsDragging ] = useState( false )
	const ref = useRef( null )
	const lastPos = useRef( 0 )
	const { deleteWidget } = getWidgetActions()

	useEffect( () => {
		setDimensions( i, {
			width: ref.current.offsetWidth,
			height: ref.current.offsetHeight,
			top: ref.current.offsetTop,
			left: ref.current.offsetLeft,
			size,
		} )
	} )

	const props = {
		id,
		size,
		title,
		type,
		settings,
		remove: () => deleteWidget( layoutHandle, id )
	}

	return (
		<motion.li
			key={ id }
			ref={ ref }
			className={ c( {
				[ `fl-asst-cell-${size}` ]: size,
				'is-dragging': isDragging
			}, className ) }
			layout
			animate={ isDragging ? onTop : flat }
			drag={ false /*'sm' === size ? true : 'y'*/ }
			dragDirectionLock
			dragConstraints={ wrap }
			dragElastic={ 0.1 }
			onDragStart={ () => setIsDragging( true ) }
			onDragEnd={ () => setIsDragging( false ) }
			onViewportBoxUpdate={ ( vBox, delta ) => {
				const x = delta.x.translate
				const y = delta.y.translate
				const distance = 0 !== x ? x : y
				const buffer = 10
				const exceedsBuffer = distance >= lastPos.current + buffer || distance <= lastPos.current - buffer

				// Are we moving x or y?
				const axis =  0 !== x ? 'x' : 'y'

				// Need to be the dragging element AND at least buffer more or less than lastY
				if ( isDragging && exceedsBuffer ) {

					updateOrder( i, distance, axis )
					lastPos.current = distance
				}
			} }
			{ ...rest }
		>
			<Widget title={ title } size={ size } type={ type }>
				<Content { ...props } />
			</Widget>
		</motion.li>
	)
}

export default Item
