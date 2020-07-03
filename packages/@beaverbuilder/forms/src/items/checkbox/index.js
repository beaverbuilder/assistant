import React from 'react'

export const CheckboxItem = ( {
	id,
	value,
	onChange = () => {},
	content,
	...rest
} ) => {
	return (
		<>
			<input
				type="checkbox"
				key={ id }
				id={ id }
				checked={ value ? true : false }
				onChange={ e => onChange( e.target.checked, e ) }
				{ ...rest }
			/>
			{ content && <label htmlFor={ id }>{content}</label> }
		</>
	)
}
