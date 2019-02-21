import React, { Fragment, useEffect } from 'react'
import { useAppState, useStore } from 'store'
import { currentUserCan } from 'utils/wordpress'
import { ExpandedContents, TagGroupControl } from 'components'

export const NotificationsFilter = () => {
	const {
		typeTags,
		commentStatusTags,
		updateTypeTags,
		setType,
		setCommentStatus,
		setUpdateType,
		type,
		commentStatus,
		updateType,
	} = getFilterData()

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

export const getFilterData = () => {
	const [ query, setQuery ] = useAppState( 'query' ) // eslint-disable-line no-unused-vars
	const [ filter, setFilter ] = useAppState( 'filter' )
	const { type, commentStatus, updateType } = filter
	const { counts } = useStore()
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

	const setType = type => {
		setFilter( { ...filter, type } )
	}

	const setCommentStatus = commentStatus => {
		setFilter( { ...filter, commentStatus } )
	}

	const setUpdateType = updateType => {
		setFilter( { ...filter, updateType } )
	}

	useEffect( () => {
		if ( 'comments' === type ) {
			setQuery( { status: commentStatus } )
		} else {
			setQuery( { type: updateType } )
		}
	}, [ type, commentStatus, updateType ] )

	return {
		typeTags,
		commentStatusTags,
		updateTypeTags,
		setType,
		setCommentStatus,
		setUpdateType,
		type,
		commentStatus,
		updateType,
	}
}
