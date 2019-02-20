import React from 'react'
import { ContentQuery } from 'components'
import { UserListItem } from './item'
import './style.scss'

export const UserList = ( { item, ...props } ) => {
	return (
		<ContentQuery
			type={ 'users' }
			item={ item ? item : <UserListItem /> }
			{ ...props }
		/>
	)
}
