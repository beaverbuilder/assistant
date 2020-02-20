import React from 'react'
import { Button as FLUID_Button } from 'fluid/ui'
const Button = { ...FLUID_Button }
export const ButtonItem = ( {
	id,
	text,
	btnclass,
	...rest
} ) => {
	return (
		<Button

			key={ id }
			id={ id }
			value={ text }
			width="100%"
			className={ btnclass }
			{ ...rest }
		>{ text }</Button>
	)
}
