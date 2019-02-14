import React from 'react'
import { ContentQuery } from 'components'
import { UpdateListItem } from './item'

export const UpdateList = ( { query, item, ...props } ) => {
	return (
		<ContentQuery
			type={ 'updates' }
			query={ query }
			pagination={ false }
			item={ item ? item : <UpdateListItem /> }
			emptyMessage={ 'You\'re all up to date!' }
			{ ...props }
		/>
	)
}
