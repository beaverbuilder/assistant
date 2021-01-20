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
