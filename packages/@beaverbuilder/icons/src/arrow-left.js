import React from 'react'

const ArrowLeft = ( { ...rest } ) => {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" { ...rest }>
			<line x1="2.75" y1="9.94765" x2="17.25" y2="9.94765" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
			<line x1="2.74802" y1="9.94822" x2="9.69557" y2="3.00067" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
			<line x1="0.75" y1="-0.75" x2="10.5753" y2="-0.75" transform="matrix(0.707107 0.707107 0.707107 -0.707107 2.74802 8.94667)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
		</svg>
	)
}

export default ArrowLeft
