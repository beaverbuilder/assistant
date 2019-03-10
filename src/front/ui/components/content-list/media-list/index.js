import React from 'react'
import { ContentQuery } from 'components'
import { MediaListItem, MediaListItemLoading } from './item'
import './style.scss'

export const MediaList = props => {
	return (
		<ContentQuery
			className={ 'fl-asst-grid-list' }
			type={ 'attachments' }
			item={ <MediaListItem /> }
			placeholderItem={ <MediaListItemLoading /> }
			placeholderItemCount={ 4 }
			{ ...props }
		/>
	)
}
