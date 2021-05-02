import React from 'react'
import ProSection from './pro'
import RecentPostsSection from './recent-posts'
import WelcomeSection from './welcome'
import AppsSection from './apps'
import MediaSection from './media'
import QuickStats from './stats'

const HomeSections = () => {
	return (
		<>
			<WelcomeSection />
			<QuickStats />
			<MediaSection />
			<ProSection />
			<AppsSection />
			<RecentPostsSection />
		</>
	)
}

export default HomeSections
