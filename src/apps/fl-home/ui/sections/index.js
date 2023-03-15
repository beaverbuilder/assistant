import React from 'react'
import { sprintf } from '@wordpress/i18n'
import { getSystemConfig, useAppState, getAppActions } from 'assistant/data'
import RecentPostsSection from './recent-posts'
import AppsSection from './apps'
import MediaSection from './media'
import QuickStats from './stats'
import CommunitySection from './community'

/* Libraries (pro) and Welcome Banner sections currently disabled */

const WelcomeMessage = () => {
	const { currentUser } = getSystemConfig()
	return sprintf( 'Welcome, %s', currentUser.displayName )
}

const HomeSections = () => {
	const { collapsedSections } = useAppState( 'fl-home' )
	const { setCollapsedSections } = getAppActions( 'fl-home' )
	const sections = [
		{
			handle: 'community',
			render: CommunitySection,
		},
		{
			handle: 'stats',
			render: props => <QuickStats title={ <WelcomeMessage /> } { ...props } />
		},
		{
			handle: 'media',
			render: MediaSection
		},
		{
			handle: 'apps',
			render: AppsSection
		},
		{
			handle: 'posts',
			render: RecentPostsSection
		},
	]

	/**
	 * Caches the expanded/collapsed state in app state
	 */
	return sections.map( ( { handle, render: Component, isHidden = false } ) => {

		if ( isHidden ) return null

		return (
			<Component
				key={ handle }
				isCollapsed={ collapsedSections.includes( handle ) }
				onToggle={ value => {

					if ( false === value && ! collapsedSections.includes( handle ) ) {
						setCollapsedSections( [ ...collapsedSections, handle ] )
					}
					if ( true === value && collapsedSections.includes( handle ) ) {
						setCollapsedSections( [ ...collapsedSections.filter( name => name !== handle ) ] )
					}
				} }
			/>
		)
	} )
}

export default HomeSections
