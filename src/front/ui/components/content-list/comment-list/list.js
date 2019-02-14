import React from 'react'
import { ContentQuery } from 'components'
import { CommentListItem } from './item'

export const CommentList = ( { query, item, ...props } ) => {
	return (
		<ContentQuery
			type={ 'comments' }
			query={ query }
			item={ item ? item : <CommentListItem /> }
			{ ...props }
		/>
	)
}
