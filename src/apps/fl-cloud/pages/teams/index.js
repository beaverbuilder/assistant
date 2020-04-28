import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form, Layout, List, Nav, Page } from 'assistant/ui'

export default () => {
	let tabs = [
		{
			handle: 'members',
			label: __( 'Members' ),
			path: '/fl-cloud/teams',
			component: TeamMembers,
			exact: true,
		},
		{
			handle: 'settings',
			label: __( 'Settings' ),
			path: '/fl-cloud/teams/tab/settings',
			component: TeamInfo,
		},
		{
			handle: 'billing',
			label: __( 'Subscription' ),
			path: '/fl-cloud/teams/tab/billing',
			component: TeamBilling,
		}
	]

	return (
		<Page
			className='fl-asst-teams-layout'
			title={ __( 'Teams' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<Layout.Box>
				<Form.SelectItem
					options={ {
						flm: __( 'FastLine Media' ),
						cf: __( 'Crowd Favorite' ),
					} }
				></Form.SelectItem>
			</Layout.Box>
			<Layout.Box
				padX={ false }
				padY={ false }
			>
				<Nav.Tabs tabs={ tabs } />
				<Nav.CurrentTab tabs={ tabs } />
			</Layout.Box>
		</Page>
	)
}

const TeamMembers = () => {
	const items = [
		{ label: 'Brent Jett', description: 'brent@jett.com' },
		{ label: 'Danny Holt', description: 'danny@holt.com' },
		{ label: 'Jamie VanRaalte', description: 'jamie@vanraalte.com' }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
		}
	}

	return (
		<List
			items={ items }
			getItemProps={ getItemProps }
		/>
	)
}

const TeamInfo = () => {
	return null
}

const TeamBilling = () => {
	return null
}
