import React from 'react'
import { ContentQuery } from 'components'
import { MediaListItem } from './item'
import './style.scss'

export const MediaList = ( { item, ...props } ) => {
	return (
		<ContentQuery
			className={ 'fl-asst-grid-list' }
			type={ 'attachments' }
			item={ item ? item : <MediaListItem /> }
			{ ...props }
		/>
	)
}
