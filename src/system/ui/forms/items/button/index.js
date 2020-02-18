import React from 'react'

export const ButtonItem = ( {
	id,
	text,
	btnclass,
	...rest
} ) => {
	return (
		<button

			key={ id }
			id={ id }
			value={text}
			width="100%"
			className={"fluid-button "+btnclass}
			{ ...rest }
		>{ text }</button>
	)
}
