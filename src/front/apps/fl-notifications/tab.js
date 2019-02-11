import React, { Fragment } from 'react'
import { useAppState } from 'store'
import { currentUserCan } from 'utils/wordpress'
import { ScreenHeader, TagGroupControl } from 'components'
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
