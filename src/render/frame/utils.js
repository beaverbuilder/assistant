import useMedia from 'use-media'
import { getSystemConfig } from 'assistant/data'

const defaultEdgeInsets = {
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
}

/**
 * A hook that tracks the height of the WP Admin Bar at different breakpoints.
 */
const useAdminBarHeight = () => {
	const { isShowingAdminBar } = getSystemConfig()
	const isSlim = useMedia( { maxWidth: 782 } )
	const isMobile = useMedia( { maxWidth: 600 } )

	if ( ! isShowingAdminBar || isMobile ) {
		return 0
	}
	return isSlim ? 46 : 32
}

/**
 * A hook that tracks edge insets for the frame.
 * Describes the distance to the edge of the viewport that the frame should rest against.
 * Returns object like { top: 32, left: 0, right: 0, bottom: 0 }
 * @param {Number || Object} initial inset(s)
 */
export const useEdgeInsets = ( insets = defaultEdgeInsets ) => {
	const adminBar = useAdminBarHeight()

	let base = insets
	if ( Number.isInteger( insets ) ) {
		base = { top: insets, right: insets, bottom: insets, left: insets }
	}

	return {
		...base,
		top: base.top + adminBar
	}
}

/**
 * Describes the panel width when collapsed or expanded
 */
const getWidth = isAppHidden => isAppHidden ? 60 : 420

/**
 * For the sake of nice animation we always use left to describe the frame's position
 * instead of switching between left or right css properties.
 */
export const getLeft = ( originX = 0, width, insets ) => {
	return originX ? `calc( 100vw - ${ width + insets.right }px )` : insets.left
}

export const getBoxShadow = ( isHidden, isAppHidden ) => {
	if ( isHidden || isAppHidden ) {
		return '0 0 0px hsla( 210, 0%, 0%, 0 )'
	} else {
		return '0 0 20px hsla( 210, 20%, 30%, .15 )'
	}
}

export const getRect = ( originX, insets, isAppHidden = false ) => {
	const width = getWidth( isAppHidden )
	return {
		top: insets.top,
		left: getLeft( originX, width, insets ),
		width,
		height: `calc( 100vh - ${ insets.top + insets.bottom }px )`
	}
}

export const isRightEdge = x => x >= ( window.innerWidth / 2 )
export const isLeftEdge = x => x < ( window.innerWidth / 2 )
export const isTopEdge = y => y < ( window.innerHeight / 2 )
export const isBottomEdge = y => y >= ( window.innerHeight / 2 )

export const getOrigin = ( { x, y } ) => {
	return [ isRightEdge( x ) ? 1 : 0, isBottomEdge( y ) ? 1 : 0 ]
}

export const originHasChanged = ( a, b ) => typeof a !== typeof b || a[0] !== b[0] || a[1] !== b[1]
