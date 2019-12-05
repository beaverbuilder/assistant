import React from 'react'

export const TextItem = ( {
	type = 'text',
	id,
	value,
	onChange = () => {},
	...rest
} ) => {
	const isTextArea = 'textarea' === type

	return (
		<>
			{ isTextArea && (
				<textarea
					key={ id }
					id={ id }
					value={ value }
					onChange={ e => onChange( e.target.value, e ) }
					{ ...rest }
				/>
			) }
			{ ! isTextArea && (
				<input
					type={ type }
					key={ id }
					id={ id }
					value={ value }
					onChange={ e => onChange( e.target.value, e ) }
					{ ...rest }
				/>
			) }
		</>
	)
}
