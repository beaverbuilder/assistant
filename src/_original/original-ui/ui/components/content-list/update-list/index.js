import React from 'react'
import { updater } from 'utils/wordpress'
import { ContentQuery } from 'components'
import { UpdateListItem } from './item'
import './style.scss'

updater.init()

export const UpdateList = props => {
	return (
		<ContentQuery
			type={ 'updates' }
			item={ <UpdateListItem /> }
			emptyMessage={ 'You\'re all up to date!' }
			{ ...props }
		/>
	)
}
