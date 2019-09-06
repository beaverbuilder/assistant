import React from 'fl-react'
import { Form } from '../'

export const TextItem = ( {
	label,
	labelPlacement,
	type = 'text',
	id,
	value,
	isRequired = false,
	onChange = () => {},
	...rest,
} ) => {

	return (
		<Form.Item label={ label } placement={ labelPlacement } labelFor={ id } isRequired={ isRequired }>
			<input type={ type } key={ id } id={ id } value={ value } onChange={ onChange } { ...rest } />
		</Form.Item>
	)
}

export const SelectItem = ( {
	label,
	labelPlacement,
	id,
	value,
	options = {},
	isRequired = false,
	onChange = () => {},
	...rest,
} ) => {

	return (
		<Form.Item label={ label } placement={ labelPlacement } labelFor={ id } isRequired={ isRequired }>
			<select
				key={ id }
				id={ id }
				value={ value }
				onChange={ onChange }
				{ ...rest }
			>
				{ Object.entries( options ).map( ( [ value, label ] ) => (
					<option key={ value } value={ value }>{label}</option>
				) )}
			</select>
		</Form.Item>
	)
}
