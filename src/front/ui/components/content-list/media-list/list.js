import React from 'react'
import { ContentQuery } from 'components'
import { MediaListItem } from './item'

export const MediaList = ( { query, item, ...props } ) => {
	return (
		<ContentQuery
			className={ 'fl-asst-grid-list' }
			type={ 'posts' }
			query={ query }
			item={ item ? item : <MediaListItem /> }
			{ ...props }
		/>
	)
}
