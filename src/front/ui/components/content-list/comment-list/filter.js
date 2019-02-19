import React, { useEffect } from 'react'
import { maybeUseAppState } from 'store'
import { ExpandedContents, TagGroupControl } from 'components'

export const CommentListFilter = ( { onChange, ...props } ) => {
	const [ activeTag, setActiveTag ] = maybeUseAppState( props, 'status', 'all' )
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
