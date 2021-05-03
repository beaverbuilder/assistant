import React from 'react'
import { sprintf } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import RecentPostsSection from './recent-posts'
import AppsSection from './apps'
import MediaSection from './media'
import QuickStats from './stats'

/* Libraries (pro) and Welcome Banner sections currently disabled */

const WelcomeMessage = () => {
	const { currentUser } = getSystemConfig()
	return (
		<>
			{ sprintf( 'Welcome, %s', currentUser.displayName ) }
		</>
	)
}

const HomeSections = () => {
	return (
		<>
			<QuickStats title={ <WelcomeMessage /> } />
			<MediaSection />
			<AppsSection />
			<RecentPostsSection />
		</>
	)
}

export default HomeSections
