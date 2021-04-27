import React from 'react'

export const TextItem = ( {
	type = 'text',
	id,
	value,
	onChange = () => {},
	...rest
} ) => {
	return (
		<input
			type={ type }
			key={ id }
			id={ id }
			value={ null === value ? '' : value }
			onChange={ e => onChange( e.target.value, e ) }
			{ ...rest }
		/>
	)
}
