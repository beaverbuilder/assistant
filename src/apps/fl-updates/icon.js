import React from 'react'
import { useSystemState } from 'assistant/data'

const AppIcon = ( { context, isSelected = false } ) => {
	const { counts } = useSystemState()
	const total = counts['update/total'] ? counts['update/total'] : 0
	const shouldHighlight = 'sidebar' === context && 0 < total
	const color = ( shouldHighlight && ! isSelected ) ? 'var(--fl-asst-orange)' : 'currentColor'

	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M19.5009 10H15.5009C15.0889 10 14.8537 10.4704 15.1009 10.8L17.1009 13.4667C17.3009 13.7333 17.7009 13.7333 17.9009 13.4667L19.9009 10.8C20.1481 10.4704 19.9129 10 19.5009 10Z" fill="currentColor" />
			<path d="M4.50091 10H0.500908C0.0888852 10 -0.146306 9.52962 0.100908 9.2L2.10091 6.53333C2.30091 6.26667 2.70091 6.26667 2.90091 6.53333L4.90091 9.2C5.14812 9.52962 4.91293 10 4.50091 10Z" fill="currentColor" />
			<path d="M17.4787 10C17.4787 5.86951 14.1303 2.52107 9.99977 2.52107C8.3171 2.52107 6.76422 3.07676 5.51463 4.01464M2.52083 10C2.52083 14.1305 5.86927 17.479 9.99977 17.479C11.6754 17.479 13.2223 16.9279 14.4692 15.9972" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
			{ shouldHighlight && <circle cx="10" cy="10" r="3" fill={ color } /> }
		</svg>
	)
}

export default AppIcon
