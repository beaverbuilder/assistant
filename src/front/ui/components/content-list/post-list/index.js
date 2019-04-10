import React from 'react'
import { ContentQuery } from 'components'
import { PostListItem } from './item'
import './style.scss'

export const PostList = props => {
	return (
		<ContentQuery
			item={ <PostListItem /> }
			{ ...props }
		/>
	)
}

export { CreatePost, CreateTerm } from './create'
export { PostListDetail } from './detail'
