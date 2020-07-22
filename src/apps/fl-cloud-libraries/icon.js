import React from 'react'
import { Icon } from 'assistant/ui'

export default ( { context } ) => {
	const width = 'sidebar' === context ? 20 : 40

	return (
		<Icon.Library width={ width } height={ width } />
	)
}
