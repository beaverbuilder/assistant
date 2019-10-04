import React from 'fl-react'
import { Form } from '../'

export const TextItem = ( {
	label,
	labelPlacement,
	type = 'text',
	id,
	value,
	hasChanges = false,
	isRequired = false,
	onChange = () => {},
	isVisible = true,
	...rest,
} ) => {

	if ( ! isVisible ) {
		return null
	}

	const isTextArea = 'textarea' === type

	return (
		<Form.Item
			label={ label }
			placement={ labelPlacement }
			labelFor={ id }
			isRequired={ isRequired }
			hasChanges={ hasChanges }
		>
			{ isTextArea && (
				<textarea
					key={ id }
					id={ id }
					value={ value }
					onChange={ e => onChange( e.target.value, e ) }
					{ ...rest }
				/>
			)}
			{ ! isTextArea && (
				<input
					type={ type }
					key={ id }
					id={ id }
					value={ value }
					onChange={ e => onChange( e.target.value, e ) }
					{ ...rest }
				/>
			)}
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
	hasChanges = false,
	onChange = () => {},
	isVisible = true,
	...rest,
} ) => {

	if ( ! isVisible ) {
		return null
	}

	return (
		<Form.Item
			label={ label }
			placement={ labelPlacement }
			labelFor={ id }
			isRequired={ isRequired }
			hasChanges={ hasChanges }
		>
			<select
				key={ id }
				id={ id }
				value={ value }
				onChange={ e => onChange( e.target.value, e ) }
				{ ...rest }
			>
				{ Object.entries( options ).map( ( [ value, label ] ) => (
					<option key={ value } value={ value }>{label}</option>
				) )}
			</select>
		</Form.Item>
	)
}

export const CheckboxItem = ( {
	label,
	labelPlacement,
	id,
	value,
	isRequired = false,
	hasChanges = false,
	onChange = () => {},
	content,
	isVisible = true,
	...rest,
} ) => {

	if ( ! isVisible ) {
		return null
	}

	return (
		<Form.Item
			label={ label }
			placement={ labelPlacement }
			isRequired={ isRequired }
			hasChanges={ hasChanges }
		>
			<input
				type="checkbox"
				key={ id }
				id={ id }
				checked={ value ? true : false }
				onChange={ e => onChange( e.target.checked, e ) }
				{ ...rest }
			/>
			{ content && <label htmlFor={ id }>{content}</label> }
		</Form.Item>
	)
}
