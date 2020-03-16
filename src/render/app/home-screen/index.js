import React from 'react'
import { Page } from 'assistant/ui'

export const HomeScreen = () => {
	return (
		<Page
			padY={ false }
			toolbar={ false }
		>
			<Page.RegisteredSections
				location={ { type: 'home' } }
				data={ {} }
			/>

			{ ! __PRODUCTION__ && (
				<>
					<PosterPlaceholder />
					<PosterPlaceholder />
					<PosterPlaceholder />
					<PosterPlaceholder />
					<PosterPlaceholder />
					<PosterPlaceholder />
					<PosterPlaceholder />
				</>
			)}
		</Page>
	)
}

const PosterPlaceholder = () => (
	<div
		style={{
			background: 'linear-gradient( 45deg, #fc466b, #3f5efb)',
			borderRadius: 30,
			height: 300,
			margin: '0 0 20px',
		}}
	></div>
)
