import React from 'react'
import { ContentQuery } from 'components'
import { UpdatesListItem } from './list-item'
import { NotificationsTabEmptyMessage } from '../empty-message'
import { updatesQuery } from './queries'

export const Updates = () => {
	return (
		<ContentQuery
			type={ 'updates' }
			query={ updatesQuery() }
			pagination={ false }
			item={ <UpdatesListItem /> }
			emptyMessage={ <NotificationsTabEmptyMessage /> }
		/>
	)
}
