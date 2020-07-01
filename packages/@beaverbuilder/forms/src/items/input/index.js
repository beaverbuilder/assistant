import React from 'react'
import classname from 'classnames'
import './style.scss'

export const Input = ( {
	className,
	appearance,
	before,
	after,
	...rest
} ) => {

	const classes = classname( {
		'fl-asst-form-input': true,
		[`fl-asst-appearance-${appearance}`]: appearance,
	}, className )

	return (
		<div className={ classes }>
			{before}
			<input { ...rest } />
			{after}
		</div>
	)
}
