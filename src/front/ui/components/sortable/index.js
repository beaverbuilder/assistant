import React, { useRef } from 'react'
import { useGesture } from 'react-with-gesture'
import { useSprings, animated, interpolate } from 'react-spring'

/**
 * WIP
 */
export const SortableList = ( { children } ) => {

	return (
		<div>
			{ React.Children.map( children, item => {
				return (
					<animated.div>
						{item}
					</animated.div>
				)
			} ) }
		</div>
	)
}
