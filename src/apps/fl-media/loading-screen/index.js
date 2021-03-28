import React from 'react'
import { Layout } from 'assistant/ui'
import './style.scss'

const LoadingScreen = () => {
	return (
		<div className="fl-asst-media-loading-screen">
			<Layout.SidebarBackdrop />
		</div>
	)
}

export default LoadingScreen
