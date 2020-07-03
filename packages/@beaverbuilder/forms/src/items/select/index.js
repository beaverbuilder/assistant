import React from 'react'

export const SelectItem = ( {
	id,
	value,
	options = {},
	selectMultiple = false,
	onChange = () => {},
	...rest
} ) => {
	return (
		<select
			key={ id }
			id={ id }
			value={ value }
			multiple={ selectMultiple }
			onChange={ e => {
				if ( selectMultiple ) {
					onChange( Array.from( e.target.selectedOptions, option => option.value ), e )
				} else {
					onChange( e.target.value, e )
				}
			} }
			{ ...rest }
		>
			{ Object.entries( options ).map( ( [ value, label ] ) => (
				<option key={ value } value={ value }>{label}</option>
			) )}
		</select>
	)
}
