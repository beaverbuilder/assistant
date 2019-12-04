import React from 'react'
import { Form, Button } from 'ui'

export const ActionsItem = ( {
	label,
	options = [],
} ) => {

	return (
		<Form.Item label={ label }>
			<Button.Group appearance="grid">
				{ Button.renderActions( options ) }
			</Button.Group>
		</Form.Item>
	)
}
