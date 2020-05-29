import React from 'react'
import { Layout, Button } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import { Card } from 'home/ui'

const CurrentlyViewing = () => {
	const { currentPageView } = getSystemConfig()
	const { intro, name, actions } = currentPageView

	return (
		<Card
			eyebrow={ intro }
			title={ name }
		>
			{ actions && (
				<Layout.Row style={{ padding: 5, paddingTop: 2 }}>
					{ actions.map( ( action, i ) => {
						const { label, isEnabled, ...rest } = action
						return false !== isEnabled && (
							<Button
								key={i}
								appearance="transparent"
								{...rest}
							>{label}</Button>
						)
					})}
				</Layout.Row>
			)}
		</Card>
	)
}

export default CurrentlyViewing
