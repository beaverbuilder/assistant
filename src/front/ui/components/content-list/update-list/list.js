import React from 'react'
import { ContentQuery } from 'components'
import { UpdateListItem } from './item'

export const UpdateList = ( { item, ...props } ) => {
	return (
		<ContentQuery
			type={ 'updates' }
			item={ item ? item : <UpdateListItem /> }
			emptyMessage={ 'You\'re all up to date!' }
			{ ...props }
		/>
	)
}
