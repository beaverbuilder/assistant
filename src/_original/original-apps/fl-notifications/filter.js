import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { useAppState, getAppActions, useSystemState } from 'store'
import { currentUserCan } from 'utils/wordpress'
import {
	NavBar,
	Header,
	StackContext,
} from 'components'

export const NotificationsFilter = () => {
	const { dismissAll } = useContext( StackContext )
	const { filter } = useAppState()
	const { setType, setCommentStatus, setUpdateType } = getAppActions()
	const { typeTags, commentStatusTags, updateTypeTags } = getFilterTags()
	const { type, commentStatus, updateType } = filter

	const navItems = []
	typeTags.map( item => {
		navItems.push( {
			children: item.label,
			onClick: () => {
				setType( item.value )
				dismissAll()
			},
			isSelected: item.value === type
		} )
	} )

	const commentStatusItems = []
	commentStatusTags.map( item => {
		commentStatusItems.push( {
			children: item.label,
			onClick: () => {
				setCommentStatus( item.value )
			},
			isSelected: item.value === commentStatus,
		} )
	} )

	const updateTypeItems = []
	updateTypeTags.map( item => {
		updateTypeItems.push( {
			children: item.label,
			onClick: () => setUpdateType( item.value ),
			isSelected: item.value === updateType
		} )
	} )

	return (
		<Fragment>

			<Header>
				<NavBar items={navItems} />
			</Header>

			{ 'comments' === type && <NavBar items={commentStatusItems} /> }
			{ 'updates' === type && <NavBar items={updateTypeItems} /> }
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
