import React from 'react'
import { Page } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'

const Header = () => {
	const { currentPageView } = getSystemConfig()
	const { site } = currentPageView
	const { icon, title } = site

	const style = {
		minHeight: 60,
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'row',
		pointerEvents:  'none',
		cursor: 'move',
	}

	return (
		<div style={style}>
			<span style={{
				flex: '0 0 60',
				background: '#23282d',
				width: 60,
				height: 60,
				borderRadius: 5,
				overflow: 'hidden',
			}}>
				<img src={icon} />
			</span>
			<span
				style={{
					flex: '1 1 auto',
					display: 'flex',
					alignItems: 'center',
					fontSize: 18,
					fontWeight: 600,
					paddingLeft: 10,
				}}
			>{title}</span>
		</div>
	)
}

const HomeScreen = () => {
	return (
		<Page
			padY={ false }
			toolbar={ false }
			header={ <Header /> }
		>
			<Page.RegisteredSections
				location={ { type: 'home' } }
				data={ {} }
			/>
		</Page>
	)
}

export default HomeScreen
