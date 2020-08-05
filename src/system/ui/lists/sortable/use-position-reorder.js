import { useRef } from 'react'
import move from 'array-move'
import findIndex from './find-index'

const usePositionReorder = ( order, setOrder ) => {

	// We need to collect an array of height and position data for all of this component's
	// `Item` children, so we can later us that in calculations to decide when a dragging
	// `Item` should swap places with its siblings.
	const positions = useRef( [] ).current
	const updatePosition = ( i, offset ) => ( positions[i] = offset )

	// Find the ideal index for a dragging item based on its position in the array, and its
	// current drag offset. If it's different to its current index, we swap this item with that
	// sibling.
	const updateOrder = ( i, dragOffset ) => {
		const targetIndex = findIndex( i, dragOffset, positions )
		if ( targetIndex !== i ) {
			setOrder( move( order, i, targetIndex ) )
		}
	}

	return [ order, updatePosition, updateOrder ]
}

export default usePositionReorder
