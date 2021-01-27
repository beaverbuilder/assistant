import React from 'react'
import { Layout, Button, Text } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import './style.scss'

const CurrentlyViewing = () => {
	const { currentPageView } = getSystemConfig()
	const { intro, name, actions } = currentPageView

	return (
		<div
			style={ {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center'
			} }
		>
			<Text.Title eyebrow={ intro }>{name}</Text.Title>
			{ actions && (
				<Layout.Row style={ { padding: '10px 0 0', justifyContent: 'flex-start' } }>
					{ actions.map( ( action, i ) => {
						const { label, isEnabled, ...rest } = action
						return false !== isEnabled && (
							<Button
								key={ i }
								{ ...rest }
							>{ label }</Button>
						)
					} )}
				</Layout.Row>
			)}
		</div>
	)
}

export default CurrentlyViewing
