import React from 'react'

const Checkmark = props => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" { ...props }>
		<path d="M3 11L7 15L17 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
)

export default Checkmark
