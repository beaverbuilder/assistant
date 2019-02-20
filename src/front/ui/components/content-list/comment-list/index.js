import React from 'react'
import { ContentQuery } from 'components'
import { CommentListItem } from './item'
import './style.scss'

export const CommentList = ( { item, ...props } ) => {
	return (
		<ContentQuery
			type={ 'comments' }
			item={ item ? item : <CommentListItem /> }
			{ ...props }
		/>
	)
}
