import React from 'react'
import { List, Page } from 'assistant/ui'

export const ListExamples = () => {
	return (
		<Page shouldPadTop={ true } shouldPadSides={ false }>
			<List.TestSheet />
		</Page>
	)
}
