import React from 'react'

export const TextareaItem = ( {
	id,
	value,
	onChange = () => {},
	...rest
} ) => {
	return (
		<textarea
			key={ id }
			id={ id }
			value={ value }
			onChange={ e => onChange( e.target.value, e ) }
			{ ...rest }
		/>
	)
}
