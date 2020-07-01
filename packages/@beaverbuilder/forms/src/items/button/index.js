import React from 'react'
import { Button } from '@beaverbuilder/fluid'

export const ButtonItem = ( {
	id,
	text,
	btnClass,
	...rest
} ) => {
	return (
		<Button
			key={ id }
			id={ id }
			value={ text }
			width="100%"
			className={ btnClass }
			{ ...rest }
		>{ text }</Button>
	)
}
