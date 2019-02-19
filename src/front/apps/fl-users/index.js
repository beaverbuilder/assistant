import React, { Fragment } from 'react'
import { useAppState, useDispatch } from 'store'
import { UserList, UserListFilter, ScreenHeader } from 'components'

const { registerApp } = useDispatch()

export const UsersTab = () => {
	const [ query, setQuery ] = useAppState( 'query', null )
	return (
		<Fragment>
			<ScreenHeader>
				<UserListFilter
					appStateKey='user-filter'
					onChange={ setQuery }
				/>
			</ScreenHeader>
			<UserList
				query={ query }
				pagination={ true }
			/>
		</Fragment>
	)
}

registerApp( 'fl-users', {
	label: 'Users',
	content: () => <UsersTab />,
} )
