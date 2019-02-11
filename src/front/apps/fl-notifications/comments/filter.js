import React, { useEffect, useState } from 'react'
import { ExpandedContents, TagGroupControl } from 'components'
import { commentsQuery } from './queries'

export const CommentsFilter = ( { onChange } ) => {
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
