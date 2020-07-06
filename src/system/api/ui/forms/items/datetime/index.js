import React from 'react'
import format from 'date-fns/format'

export const DatetimeItem = ( {
	id,
	value,
	format,
	...rest
} ) => {
	return (
		<div
			id={ id }
			{ ...rest }
		>
			{ format( value, format ) }
		</div>
	)
}
