import useMedia from 'use-media'
import { getSystemConfig } from 'assistant/data'

const defaultEdgeInsets = {
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
}

const useAdminBarHeight = () => {
	const { isShowingAdminBar } = getSystemConfig()
	const isSlim = useMedia( { maxWidth: 782 } )
	const isMobile = useMedia( { maxWidth: 600 } )

	if ( ! isShowingAdminBar || isMobile ) {
		return 0
	}
	return isSlim ? 46 : 32
}

export const useEdgeInsets = ( insets = defaultEdgeInsets ) => {
	const adminBar = useAdminBarHeight()
	return {
		...insets,
		top: insets.top + adminBar
	}
}

export const getHeight = insets => `calc( 100vh - ${ insets.top + insets.bottom }px )`

export const getWidth = isAppHidden => isAppHidden ? 60 : 420

export const getTop = insets => insets.top

export const getLeft = ( originX = 0, width, insets ) => {
	return originX ? `calc( 100vw - ${ width + insets.left }px )` : insets.left
}

export const getBoxShadow = ( isHidden, isAppHidden ) => {
	if ( isHidden || isAppHidden ) {
		return '0 0 0px hsla( 210, 0%, 0%, 0 )'
	} else {
		return '0 0 20px hsla( 210, 20%, 30%, .15 )'
	}
}

export const isRightEdge = x => x >= ( window.innerWidth / 2 )
