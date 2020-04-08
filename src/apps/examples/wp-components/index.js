import React, { useState } from 'react'
import { Page } from 'assistant/ui'
import { Button, CheckboxControl } from '@wordpress/components'

const App = () => {
	const [ isChecked, setIsChecked ] = useState( true )
	return (
		<Page title="WP Components">
			<Page.Section label="Button">
				<Button>Button</Button>
				<Button isPrimary={ true }>Button</Button>
			</Page.Section>
			<Page.Section label="Checkbox">
				<CheckboxControl
					heading="User"
					label="Is author"
					help="Is the user a author or not?"
					checked={ isChecked }
					onChange={ setIsChecked }
				/>
			</Page.Section>
		</Page>
	)
}

export default App
