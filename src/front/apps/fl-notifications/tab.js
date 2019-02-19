import React, { Fragment, useEffect, useState } from 'react'
import { useAppState, useDispatch } from 'store'
import { currentUserCan } from 'utils/wordpress'
import {
	CommentList,
	CommentListFilter,
	ScreenHeader,
	TagGroupControl,
	UpdateListFilter,
	UpdateList
} from 'components'

const { registerApp } = useDispatch()

export const NotificationsTab = () => {
	const canModerateComments = currentUserCan( 'moderate_comments' )
	const canUpdate = currentUserCan( 'update_plugins' ) || currentUserCan( 'update_themes' )
	const defaultTag = canModerateComments ? 'comments' : 'updates'
	const [ activeTag, setActiveTag ] = useAppState( 'activeTag', defaultTag )
	const [ query, setQuery ] = useState( {} )
	const tabs = []
	const filters = {}
	const content = {}

	useEffect( () => {
		setQuery( {} )
	}, [ activeTag ] )

	if ( canModerateComments ) {
		tabs.push( {
			label: 'Comments',
			value: 'comments',
		} )
		filters.comments = <CommentListFilter onChange={ setQuery } />
		content.comments = <CommentList query={ query } pagination={ true } />
	}

	if ( canUpdate ) {
		tabs.push( {
			label: 'Updates',
			value: 'updates',
		} )
		filters.updates = <UpdateListFilter onChange={ setQuery } />
		content.updates = <UpdateList query={ query } />
	}

	return (
		<Fragment>
			<ScreenHeader>
				<TagGroupControl
					tags={ tabs }
					value={ activeTag }
					onChange={ value => setActiveTag( value ) }
					appearance="vibrant"
				/>
				{ filters[ activeTag ] ? filters[ activeTag ] : null }
			</ScreenHeader>
			{ content[ activeTag ] ? content[ activeTag ] : null }
		</Fragment>
	)
}

registerApp( 'fl-notifications', {
	label: 'Notifications',
	content: props => <NotificationsTab {...props} />,
	icon: props => <NotificationsIcon {...props} />,
	enabled: (
		currentUserCan( 'update_plugins' ) ||
		currentUserCan( 'update_themes' ) ||
		currentUserCan( 'moderate_comments' )
	)
} )
