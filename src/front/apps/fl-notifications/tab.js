import React, { Fragment } from 'react'
import { useAppState, getSystemActions } from 'store'
import { currentUserCan } from 'utils/wordpress'
import { ScreenHeader, CommentList, UpdateList } from 'components'
import { NotificationsFilter } from './filter'

const { registerApp } = getSystemActions()

export const App = () => {
	const { query, filter } = useAppState()
	const { type } = filter

	return (
		<Fragment>
			<ScreenHeader>
				<NotificationsFilter />
			</ScreenHeader>
			{ 'comments' === type && <CommentList query={ query } pagination={ true } /> }
			{ 'updates' === type && <UpdateList query={ query } /> }
		</Fragment>
	)
}

registerApp( 'fl-notifications', {
	label: 'Notifications',
	content: props => <App {...props} />,
	enabled: (
		currentUserCan( 'update_plugins' ) ||
		currentUserCan( 'update_themes' ) ||
		currentUserCan( 'moderate_comments' )
	),
	state: {
		query: null,
		filter: {
			type: currentUserCan( 'moderate_comments' ) ? 'comments' : 'updates',
			commentStatus: 'all',
			updateType: 'all',
		},
	},
} )
