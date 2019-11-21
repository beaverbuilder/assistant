import React from 'react'
import classname from 'classnames'

import './reset.scss'
import './style.scss'
import './forms.scss'

export const Appearance = ( {
	className,
	brightness,
	...rest,
} ) => {

	const classes = classname( {
		'fl-asst-appearance': true,
		[`fl-asst-brightness-${brightness}`]: brightness,
		[`fluid-color-scheme-${brightness}`]: brightness,
	}, className )

	return (
		<div className={ classes } { ...rest } />
	)
}
