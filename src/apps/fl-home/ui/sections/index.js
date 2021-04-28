import React from 'react'
import ProSection from './pro'
import RecentPostsSection from './recent-posts'
import WelcomeSection from './welcome'
import AppsSection from './apps'
import MediaSection from './media'

const HomeSections = () => {
	return (
		<>
			<WelcomeSection />
			<ProSection />
			<AppsSection />
			<RecentPostsSection />
			<MediaSection />
		</>
	)
}

export default HomeSections
