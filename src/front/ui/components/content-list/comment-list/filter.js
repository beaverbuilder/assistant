import React, { useEffect, useState } from 'react'
import { ExpandedContents, TagGroupControl } from 'components'
import { commentsQuery } from './queries'

export const CommentListFilter = ( { onChange } ) => {
	const [ activeTag, setActiveTag ] = useState( 'all' )
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
		}
	]

	useEffect( () => {
		onChange( commentsQuery( activeTag ) )
	}, [ activeTag ] )

	return (
		<ExpandedContents>
			<TagGroupControl tags={ tags } value={ activeTag } title="Status" onChange={ setActiveTag } />
		</ExpandedContents>
	)
}
