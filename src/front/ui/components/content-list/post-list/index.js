import React from 'react'
import { ContentQuery } from 'components'
import { PostListItem } from './item'

export const PostList = props => {
	return (
		<ContentQuery
			item={ <PostListItem /> }
			{ ...props }
		/>
	)
}

export { PostListDetail } from './post-detail'
