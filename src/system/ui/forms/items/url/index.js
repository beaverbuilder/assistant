import React from 'react'
import { Form, Control } from 'ui'

export const UrlItem = ( {
	label,
	id,
	value,
} ) => {

	return (
		<Form.Item label={ label }>
			<Control.URL
				id={ id }
				value={ value }
			/>
		</Form.Item>
	)
}
