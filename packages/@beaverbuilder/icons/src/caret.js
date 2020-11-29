import React from 'react'

const Caret = ( { direction = 'right', ...rest } ) => {

	let path = 'M7 4L13 10L7 16'

	if ( 'left' === direction ) {
		path = 'M13 16L7 10L13 4'
	} else if ( 'up' === direction ) {
		path = 'M16 13L10 7L4 13'
	} else if ( 'down' === direction ) {
		path = 'M16 7L10 13L4 7'
	}

	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" { ...rest }>
			<path d={ path } stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
		</svg>
	)
}

export const CaretUp = props => <Caret direction="up" { ...props } />

export const CaretDown = props => <Caret direction="down" { ...props } />

export const CaretRight = props => <Caret direction="right" { ...props } />

export const CaretLeft = props => <Caret direction="left" { ...props } />

export default Caret
