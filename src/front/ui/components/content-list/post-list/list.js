import React from 'react'
import { ContentQuery } from 'components'
import { PostListItem } from './item'

export const PostList = ( { type, query, item, ...props } ) => {
	return (
		<ContentQuery
			type={ type }
			query={ query }
			item={ item ? item : <PostListItem /> }
			{ ...props }
		/>
	)
}
