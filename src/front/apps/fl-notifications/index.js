import React, { Fragment } from 'react'
import { useAppState, useDispatch, useStore } from 'store'
import { currentUserCan } from 'utils/wordpress/user'
import { AppTabButton, ScreenHeader, TagGroupControl } from 'components'
import { Comments } from './comments'
import { Updates } from './updates'

export const NotificationsTab = () => {
	const canModerateComments = currentUserCan( 'moderate_comments' )
	const canUpdate = currentUserCan( 'update_plugins' ) || currentUserCan( 'update_themes' )
	const defaultTab = canModerateComments ? 'comments' : 'updates'
	const [ activeTab, setActiveTab ] = useAppState( 'activeTab', defaultTab )
	const tabs = []
	const content = {}

	if ( canModerateComments ) {
		tabs.push( {
			label: 'Comments',
			value: 'comments',
		} )
		content.comments = <Comments />
	}

	if ( canUpdate ) {
		tabs.push( {
			label: 'Updates',
			value: 'updates',
		} )
		content.updates = <Updates />
	}

	return (
		<Fragment>
			<ScreenHeader>
				<TagGroupControl
					tags={ tabs }
					value={ activeTab }
					onChange={ value => setActiveTab( value ) }
					appearance="vibrant"
				/>
			</ScreenHeader>
			{ content[ activeTab ] ? content[ activeTab ] : null }
		</Fragment>
	)
}

export const NotificationsTabButton = () => {
	const { apps, activeApp } = useStore()
	const { setActiveApp } = useDispatch()
	const notifications = apps[ 'fl-notifications' ] ? apps[ 'fl-notifications' ] : null
	const active = 'fl-notifications' === activeApp

	if ( ! notifications || ! notifications.enabled ) {
		return null
	}

	return (
		<AppTabButton
			onClick={ () => setActiveApp( 'fl-notifications' ) }
			isSelected={ active }
			tooltip={ notifications.label }
		>
			<NotificationsIcon isSelected={ active } />
		</AppTabButton>
	)
}

export const NotificationsIcon = () => {
	return (
		<svg width="20px" height="19px" viewBox="0 0 20 19" version="1.1">
			<g fill="currentColor" transform="translate(-319.000000, -53.000000)">
				<path d="M327,72 C328.04,72 328.882353,71.1945 328.882353,70.2 L325.117647,70.2 C325.117647,71.1945 325.96,72 327,72 Z M332.976668,66.0590357 L332.976668,61.65 C332.976668,58.8825 331.108235,56.574 328.411765,55.962 L328.411765,55.0911483 C328.411765,54.3441483 327.781176,54 327,54 C326.218824,54 325.588235,54.3441483 325.588235,55.0911483 L325.588235,55.962 C322.891765,56.574 320.98235,58.8825 320.98235,61.65 L320.98235,66.0590357 L319,67.0215302 L319,68.9750312 L335,68.9750312 L335,67.0215302 L332.976668,66.0590357 Z M331.056143,67.0382342 L322.940315,67.0382342 L322.940315,61.65 C322.940315,59.4135 324.661176,57.6 327,57.6 C329.338824,57.6 331.056143,59.4135 331.056143,61.65 L331.056143,67.0382342 Z"></path>
				<circle fill="#E10000" cx="336.5" cy="55.5" r="2.5"></circle>
			</g>
		</svg>
	)
}
