import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { useSystemState } from 'assistant/data'

const AssistantRouter = ( { children } ) => {
	const { history } = useSystemState( false )

	const props = {
		initialIndex: history.index
	}
	if ( history.entries && history.entries.length ) {
		props.initialEntries = history.entries
	}

	return (
		<MemoryRouter { ...props } >
			{ children }
		</MemoryRouter>
	)
}

export default AssistantRouter
