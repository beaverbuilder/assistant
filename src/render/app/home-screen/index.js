import React from 'react'
import { Page } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import './style.scss'

const Header = () => {
	const { currentPageView } = getSystemConfig()
	const { site } = currentPageView
	const { icon, title, description, homeURL } = site

	return (
		<div className="fl-asst-site-identity">
			<a className="fl-asst-site-icon" href={ homeURL }>
				<img src={ icon } />
			</a>
			<span className="fl-asst-site-title-area">
				<span className="fl-asst-site-title">{title}</span>
				{ description && <span>{description}</span> }
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
