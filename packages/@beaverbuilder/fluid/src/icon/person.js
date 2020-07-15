import React from 'react'

const Person = ( { strokeWidth = 1.5, color = 'currentColor', ...rest } ) => {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" { ...rest }>
			<path d="M19 19C19 18.0475 18.748 16.9941 18.2119 16C17.0596 13.8632 14.5949 12 10.5 12H9.5" stroke={ color } strokeWidth={ strokeWidth } strokeLinecap="round"/>
			<path d="M0.999999 19C0.999999 17.3599 1.74722 15.4209 3.40506 14" stroke={ color } strokeWidth={ strokeWidth } strokeLinecap="round"/>
			<path d="M9.5 12C6.46243 12 4 9.53757 4 6.5C4 3.46243 6.46243 1 9.5 1C12.5376 1 15 3.46243 15 6.5C15 7.02001 14.9278 7.52317 14.793 8" stroke={ color } strokeWidth={ strokeWidth } strokeLinecap="round"/>
		</svg>
	)
}

export default Person
