import React, { Fragment, useEffect, useState } from 'react'
import { useAppState } from 'store'
import { currentUserCan } from 'utils/wordpress'
import { ScreenHeader, TagGroupControl } from 'components'
import { CommentsFilter, CommentsList } from './comments'
import { UpdatesFilter, UpdatesList } from './updates'

export const NotificationsTab = () => {
	const canModerateComments = currentUserCan( 'moderate_comments' )
	const canUpdate = currentUserCan( 'update_plugins' ) || currentUserCan( 'update_themes' )
	const defaultTag = canModerateComments ? 'comments' : 'updates'
	const [ activeTag, setActiveTag ] = useAppState( 'activeTag', defaultTag )
	const [ query, setQuery ] = useState( [] )
	const tabs = []
	const filters = {}
	const content = {}

	useEffect( () => {
		setQuery( [] )
	}, [ activeTag ] )

	if ( canModerateComments ) {
		tabs.push( {
			label: 'Comments',
			value: 'comments',
		} )
		filters.comments = <CommentsFilter onChange={ setQuery } />
		content.comments = <CommentsList query={ query } />
	}

	if ( canUpdate ) {
		tabs.push( {
			label: 'Updates',
			value: 'updates',
		} )
		filters.updates = <UpdatesFilter onChange={ setQuery } />
		content.updates = <UpdatesList query={ query } />
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
