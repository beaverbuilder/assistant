import React from 'react'
import { ContentQuery } from 'components'
import { UpdatesListItem } from './list-item'
import { UpdatesEmptyMessage } from './empty-message'

export const UpdatesList = ( { query } ) => {
	return (
		<ContentQuery
			type={ 'updates' }
			query={ query }
			pagination={ false }
			item={ <UpdatesListItem /> }
			emptyMessage={ <UpdatesEmptyMessage /> }
		/>
	)
}
