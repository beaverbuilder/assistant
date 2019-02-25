import React, { Fragment } from 'react'
import { useAppState, getAppActions, useSystemState } from 'store'
import { currentUserCan } from 'utils/wordpress'
import { ExpandedContents, TagGroupControl } from 'components'

export const NotificationsFilter = () => {
	const { filter } = useAppState()
	const { setType, setCommentStatus, setUpdateType } = getAppActions()
	const { typeTags, commentStatusTags, updateTypeTags } = getFilterTags()
	const { type, commentStatus, updateType } = filter

	return (
		<Fragment>
			<TagGroupControl
				tags={ typeTags }
				value={ type }
				onChange={ setType }
				appearance="vibrant"
			/>
			<ExpandedContents>
				{ 'comments' === type &&
					<TagGroupControl
						title="Status"
						tags={ commentStatusTags }
						value={ commentStatus }
						onChange={ setCommentStatus } />
				}
				{ 'updates' === type &&
					<TagGroupControl
						title="Status"
						tags={ updateTypeTags }
						value={ updateType }
						onChange={ setUpdateType } />
				}
			</ExpandedContents>
		</Fragment>
	)
}

export const getFilterTags = () => {
	const { counts } = useSystemState()
	const canModerateComments = currentUserCan( 'moderate_comments' )
	const canUpdate = currentUserCan( 'update_plugins' ) || currentUserCan( 'update_themes' )
	const typeTags = []

	if ( canModerateComments ) {
		typeTags.push( {
			label: 'Comments',
			value: 'comments',
			count: counts[ 'notifications/comments' ] || '0',
		} )
	}

	if ( canUpdate ) {
		typeTags.push( {
			label: 'Updates',
			value: 'updates',
			count: counts[ 'notifications/updates' ] || '0',
		} )
	}

	const commentStatusTags = [
		{
			label: 'All',
			value: 'all',
		},
		{
			label: 'Pending',
			value: 'hold',
		},
		{
			label: 'Approved',
			value: 'approve',
		},
		{
			label: 'Spam',
			value: 'spam',
		},
		{
			label: 'Trash',
			value: 'trash',
		}
	]

	const updateTypeTags = [
		{
			label: 'All',
			value: 'all',
		},
		{
			label: 'Plugins',
			value: 'plugins',
		},
		{
			label: 'Themes',
			value: 'themes',
		}
	]

	return {
		typeTags,
		commentStatusTags,
		updateTypeTags,
	}
}
