import React from 'react'
import { Page } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import './style.scss'

const Header = () => {
	const { currentPageView } = getSystemConfig()
	const { site } = currentPageView
	const { icon, title, description } = site

	return (
		<div className="fl-asst-site-identity">
			<span className="fl-asst-site-icon">
				<img src={ icon } />
			</span>
			<span className="fl-asst-site-title-area">
				<span className="fl-asst-site-title">{title}</span>
				{ description && (
					<span className="fl-asst-site-description">{description}</span>
				) }
			</span>
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
