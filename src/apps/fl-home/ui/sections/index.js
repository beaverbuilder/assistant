import React from 'react'
import LibrariesSection from './pro'
import RecentPostsSection from './recent-posts'
import WelcomeSection from './welcome'
import AppsSection from './apps'
import MediaSection from './media'
import QuickStats from './stats'

const HomeSections = () => {
	return (
		<>
			<WelcomeSection />
			<AppsSection />
			<QuickStats />
			<LibrariesSection />
			<MediaSection />
			<RecentPostsSection />
		</>
	)
}

export default HomeSections
