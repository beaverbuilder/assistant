import React from 'react'
import { updater } from 'utils/wordpress'
import { ContentQuery } from 'components'
import { UpdateListItem } from './item'
import './style.scss'

updater.init()

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
