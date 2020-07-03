import React from 'react'

export const PlainTextItem = ( {
	id,
	value,
	...rest
} ) => {
	return <div id={ id } { ...rest }>{ value }</div>
}
