import React from 'react'
import { ContentQuery } from 'components'
import { CommentsListItem } from './list-item'

export const CommentsList = ( { query } ) => {
	return (
		<ContentQuery
			type={ 'comments' }
			query={ query }
			pagination={ true }
			item={ <CommentsListItem /> }
		/>
	)
}
