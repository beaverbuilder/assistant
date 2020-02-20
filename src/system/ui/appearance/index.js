import React from 'react'
import classname from 'classnames'

import './reset.scss'
import './style.scss'
import './forms.scss'

export const Appearance = ( {
	className,
	brightness,
	...rest
} ) => {

	const classes = classname( {
		'fl-asst-appearance': true,
		[`fl-asst-brightness-${brightness}`]: brightness,
		[`fluid-color-scheme-${brightness}`]: brightness,
	}, className )

	const style = { // This stuff is mainly for the BB panel integration
		maxHeight: '100%',
		minHeight: 0,
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'column',
	}

	return (
		<div className={ classes } { ...rest } style={ style } />
	)
}
