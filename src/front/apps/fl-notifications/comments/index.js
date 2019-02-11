import React from 'react'
import { ContentQuery } from 'components'
import { commentsQuery } from './queries'

export const Comments = () => {
	return (
		<ContentQuery
			type={ 'comments' }
			query={ commentsQuery() }
			pagination={ true }
		/>
	)
}
