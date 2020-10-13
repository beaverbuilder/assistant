import React from 'react'
import classname from 'classnames'
import './style.scss'

const Attention = ( { children, className, ...rest } ) => {
	const classes = classname( {
		'fl-asst-attention': true,
	}, className )

	return (
		<>
			<svg width="0" height="0" viewBox="0 0 360 554" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<mask id="attention-mask" maskunits="objectBoundingBox"
						maskcontentunits="objectBoundingBox">
						<rect width="100" height="100" fill="black"></rect>
						<path fillRule="evenodd" d="M360 0H0V554C0 537.431 13.4315 524 30 524H330C346.569 524 360 510.569 360 494V0Z" fill="white"/>
					</mask>
				</defs>
			</svg>
			<div className={ classes } { ...rest }>{children}</div>
		</>
	)
}

export default Attention
