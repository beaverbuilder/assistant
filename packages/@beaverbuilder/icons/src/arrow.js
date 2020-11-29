import React from 'react'

const Arrow = ( { direction = 'right', ...rest } ) => {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" { ...rest }>
			{ 'left' === direction && (
				<>
					<line x1="2.75" y1="9.94765" x2="17.25" y2="9.94765" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					<line x1="2.74802" y1="9.94822" x2="9.69557" y2="3.00067" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					<line x1="0.75" y1="-0.75" x2="10.5753" y2="-0.75" transform="matrix(0.707107 0.707107 0.707107 -0.707107 2.74802 8.94667)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
				</>
			) }
			{ 'right' === direction && (
				<>
					<line x1="17.25" y1="10.0079" x2="2.75" y2="10.0079" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					<line x1="17.252" y1="10.0073" x2="10.3044" y2="16.9549" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					<line x1="0.75" y1="-0.75" x2="10.5753" y2="-0.75" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 17.252 11.0089)" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
				</>
			) }
			{ 'up' === direction && (
				<>
					<line x1="10.0301" y1="2.72777" x2="10.0301" y2="17.2278" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					<line x1="10.0295" y1="2.72578" x2="16.9771" y2="9.67334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					<line x1="0.75" y1="-0.75" x2="10.5753" y2="-0.75" transform="matrix(-0.707107 0.707107 0.707107 0.707107 11.0311 2.72578)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				</>
			) }
			{ 'down' === direction && (
				<>
					<line x1="9.96985" y1="17.2278" x2="9.96985" y2="2.72777" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					<line x1="9.97047" y1="17.2298" x2="3.02292" y2="10.2822" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					<line x1="0.75" y1="-0.75" x2="10.5753" y2="-0.75" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 8.96887 17.2298)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
				</>
			) }
		</svg>
	)
}

export const ArrowLeft = props => <Arrow direction="left" { ...props } />

export const ArrowRight = props => <Arrow direction="right" { ...props } />

export const ArrowUp = props => <Arrow direction="up" { ...props } />

export const ArrowDown = props => <Arrow direction="down" { ...props } />

export default Arrow
