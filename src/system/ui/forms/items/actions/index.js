import React from 'react'
import { Button } from 'ui'

export const ActionsItem = ( {
	options = [],
} ) => {
	return (
		<Button.Group appearance="grid">
			{ Button.renderActions( options ) }
		</Button.Group>
	)
}
