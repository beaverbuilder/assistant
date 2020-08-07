import React from 'react'

const Close = ({ ...rest }) => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
		<path d="M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
		<path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
	</svg>
)

export default Close
