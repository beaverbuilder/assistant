import React from 'react'
import { formatDate } from 'utils/datetime'

export const DateTimeItem = ( {
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
