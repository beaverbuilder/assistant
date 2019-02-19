import React from 'react'
import { ContentQuery } from 'components'
import { CommentListItem } from './item'

export const CommentList = ( { item, ...props } ) => {
	return (
		<ContentQuery
			type={ 'comments' }
			item={ item ? item : <CommentListItem /> }
			{ ...props }
		/>
	)
}
