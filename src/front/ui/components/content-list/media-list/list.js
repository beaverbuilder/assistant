import React from 'react'
import { ContentQuery } from 'components'
import { MediaListItem } from './item'

export const MediaList = ( { item, ...props } ) => {
	return (
		<ContentQuery
			className={ 'fl-asst-grid-list' }
			type={ 'posts' }
			item={ item ? item : <MediaListItem /> }
			{ ...props }
		/>
	)
}
