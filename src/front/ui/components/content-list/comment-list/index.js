import React from 'react'
import { ContentQuery } from 'components'
import { CommentListItem } from './item'
import './style.scss'

export const CommentList = props => {
	return (
		<ContentQuery
			type={ 'comments' }
			item={ <CommentListItem /> }
			{ ...props }
		/>
	)
}
