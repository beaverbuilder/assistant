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
	const isMobile = useMedia( { maxWidth: 782 } )

	if ( ! isShowingAdminBar ) {
		return 0
	}

	return isMobile ? 46 : 32
}

export const useEdgeInsets = ( insets = defaultEdgeInsets ) => {
	const adminBar = useAdminBarHeight()
	return {
		...insets,
		top: insets.top + adminBar
	}
}
