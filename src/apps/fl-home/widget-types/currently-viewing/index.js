import React from 'react'
import { Layout, Button, Text } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'

const CurrentlyViewing = () => {
	const { currentPageView } = getSystemConfig()
	const { intro, name, actions } = currentPageView

	return (
		<>
			<Text.Title eyebrow={ intro }>{name}</Text.Title>
			{ actions && (
				<Layout.Row style={ { padding: 5, paddingTop: 2 } }>
					{ actions.map( ( action, i ) => {
						const { label, isEnabled, ...rest } = action
						return false !== isEnabled && (
							<Button
								key={ i }
								appearance="transparent"
								{ ...rest }
							>{ label }</Button>
						)
					} )}
				</Layout.Row>
			)}
		</>
	)
}

export default CurrentlyViewing
