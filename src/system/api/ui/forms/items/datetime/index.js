import React from 'react'
import formatDate from 'date-fns/format'

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
			{ formatDate( value, format ) }
		</div>
	)
}
