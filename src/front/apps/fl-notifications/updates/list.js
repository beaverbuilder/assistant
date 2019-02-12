import React from 'react'
import { ContentQuery } from 'components'
import { UpdatesListItem } from './list-item'
import { UpdatesEmptyMessage } from './empty-message'
import { updatesQuery } from './queries'

export const UpdatesList = () => {
	return (
		<ContentQuery
			type={ 'updates' }
			query={ updatesQuery() }
			pagination={ false }
			item={ <UpdatesListItem /> }
			emptyMessage={ <UpdatesEmptyMessage /> }
		/>
	)
}
