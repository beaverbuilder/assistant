import React from 'react'
import { ContentQuery } from 'components'
import { UserListItem } from './item'
import './style.scss'

export const UserList = props => {
	return (
		<ContentQuery
			type={ 'users' }
			item={ <UserListItem /> }
			{ ...props }
		/>
	)
}

export { UserDetail } from './detail'
