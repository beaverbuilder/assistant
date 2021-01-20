import useMedia from 'use-media'

const defaultEdgeInsets = {
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
}

const useAdminBarHeight = () => {
	const isMobile = useMedia( { maxWidth: 782 } )
	return isMobile ? 46 : 32
}

export const useEdgeInsets = ( insets = defaultEdgeInsets ) => {
	const adminBar = useAdminBarHeight()
	return {
		...insets,
		top: insets.top + adminBar
	}
}
