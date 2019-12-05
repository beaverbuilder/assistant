import React from 'react'
import { Control } from 'ui'

export const UrlItem = ( {
	id,
	value,
} ) => {
	return (
		<Control.URL
			id={ id }
			value={ value }
		/>
	)
}
