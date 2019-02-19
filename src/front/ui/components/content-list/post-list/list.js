import React from 'react'
import { ContentQuery } from 'components'
import { PostListItem } from './item'

export const PostList = ( { item, ...props } ) => {
	return (
		<ContentQuery
			item={ item ? item : <PostListItem /> }
			{ ...props }
		/>
	)
}
