import React, { Fragment } from 'react'
import { __ } from '@wordpress/i18n'
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
						title={__( 'Status' )}
						tags={ commentStatusTags }
						value={ commentStatus }
						onChange={ setCommentStatus } />
				}
				{ 'updates' === type &&
					<TagGroupControl
						title={__( 'Status' )}
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
			label: __( 'Comments' ),
			value: 'comments',
			count: counts[ 'comment/total' ] || '0',
		} )
	}

	if ( canUpdate ) {
		typeTags.push( {
			label: __( 'Updates' ),
			value: 'updates',
			count: counts[ 'update/total' ] || '0',
		} )
	}

	const commentStatusTags = [
		{
			label: __( 'All' ),
			value: 'all',
		},
		{
			label: __( 'Pending' ),
			value: 'hold',
		},
		{
			label: __( 'Approved' ),
			value: 'approve',
		},
		{
			label: __( 'Spam' ),
			value: 'spam',
		},
		{
			label: __( 'Trash' ),
			value: 'trash',
		}
	]

	const updateTypeTags = [
		{
			label: __( 'All' ),
			value: 'all',
		},
		{
			label: __( 'Plugins' ),
			value: 'plugins',
		},
		{
			label: __( 'Themes' ),
			value: 'themes',
		}
	]

	return {
		typeTags,
		commentStatusTags,
		updateTypeTags,
	}
}
