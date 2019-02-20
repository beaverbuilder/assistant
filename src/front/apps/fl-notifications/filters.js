import React, { useEffect } from 'react'
import { useAppState } from 'store'
import { ExpandedContents, TagGroupControl } from 'components'

export const CommentListFilter = ( { onChange } ) => {
	const [ activeTag, setActiveTag ] = useAppState( 'comment-filter-status', 'all' )
	const tags = [
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

	useEffect( () => {
		onChange( {
			status: activeTag,
		} )
	}, [ activeTag ] )

	return (
		<ExpandedContents>
			<TagGroupControl tags={ tags } value={ activeTag } title="Status" onChange={ setActiveTag } />
		</ExpandedContents>
	)
}

export const UpdateListFilter = ( { onChange } ) => {
	const [ activeTag, setActiveTag ] = useAppState( 'update-filter-type', 'all' )
	const tags = [
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

	useEffect( () => {
		onChange( {
			type: activeTag,
		} )
	}, [ activeTag ] )

	return (
		<ExpandedContents>
			<TagGroupControl tags={ tags } value={ activeTag } title="Status" onChange={ setActiveTag } />
		</ExpandedContents>
	)
}
