import React, { Fragment, useContext } from 'react'
import { getDispatch } from 'store'
import {
	Button,
	Separator,
	Widget,
	ActionGroup,
	ScreenHeader,
	StackContext,
} from 'components'

import { CurrentlyViewing } from './currently-viewing'
import { RecentlyEditedWidget } from './recently-edited'
import { RecentCommentsWidget } from './recent-comments'
import { getConfig } from 'store'
import './style.scss'

const { registerApp } = getDispatch()

const DetailView = () => {
	const { pushView } = useContext( StackContext )
	return (
		<Fragment>
			<ScreenHeader title="Detail View 1" />

			<Button onClick={ () => pushView( <DetailView /> )}>Next</Button>
		</Fragment>
	)
}

export const App = () => {
	const { currentUser, dashboardApp } = getConfig()
	const { adminActions } = dashboardApp

	return (
		<Fragment>
			<ScreenHeader title={`Welcome, ${currentUser.name}`}>
				<CurrentlyViewing />
			</ScreenHeader>

			<RecentlyEditedWidget />
			<Separator />

			<Widget title="Admin Links">
				<ActionGroup actions={adminActions} appearance="" />
			</Widget>
			<Separator />

			<RecentCommentsWidget />
			<Separator />
		</Fragment>
	)
}

export const AppIcon = () => {
	return (
		<svg width="30px" height="24px" viewBox="0 0 30 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g transform="translate(-102.000000, -145.000000)" fill="transparent" fillRule="nonzero" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M124,167.010842 C126.671358,167.010842 128.67605,167.010842 130.014075,167.010842 L130.014075,148 C130.014075,146.895431 129.118644,146 128.014075,146 L106,146 C104.895431,146 104,146.895431 104,148 L104,165.010842 C104,166.115411 104.895431,167.010842 106,167.010842 L110,167.010842" />
				<path d="M117,167 L111,157" />
				<path d="M111.04454,163.319505 C110.382291,164.388826 110,165.649768 110,167 M124,167 C124,163.134007 120.865993,160 117,160" />
				<path d="M130,160 C128,153.333333 123.666667,150 117,150 C110.333333,150 106,153.333333 104,160" strokeDasharray="0,5" />
			</g>
		</svg>
	)
}

registerApp( 'fl-dashboard', {
	label: 'Dashboard',
	content: props => <App {...props} />,
	icon: props => <AppIcon {...props} />,
} )
