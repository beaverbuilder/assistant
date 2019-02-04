import React from 'react'
import { ContentQuery } from 'components'
import { NotificationsTabEmptyMessage } from '../empty-message'
import { commentsQuery } from './queries'

export const Comments = () => {
	return (
		<ContentQuery
			type={ 'comments' }
			query={ commentsQuery() }
			pagination={ false }
			emptyMessage={ <NotificationsTabEmptyMessage /> }
		/>
	)
}
