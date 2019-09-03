import React, { useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Control } from 'assistant/ui'

const dummieCode = `body { color: red; }

.fl-whatever {
  color: red;
}

// Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Etiam porta sem malesuada magna mollis euismod.
`

export const StyleApp = () => {
	const [ code, setCode ] = useState( dummieCode )
	return (
		<Page shouldPadSides={ false }>
			<Page.Section label={ __( 'CSS' ) } contentStyle={ { padding: 0, fontSize: 16 } }>
				<Control.Code
					value={ code }
					onChange={ v => setCode( v ) }
				/>
			</Page.Section>
		</Page>
	)
}

StyleApp.Icon = () => {
	return null
}
