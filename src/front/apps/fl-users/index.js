import React, { Fragment, useState } from 'react'
import { useDispatch } from 'store'
import { UserList, UserListFilter, ScreenHeader } from 'components'

const { registerApp } = useDispatch()

export const UsersTab = () => {
	const [ query, setQuery ] = useState( { role: 'all' } )
	return (
		<Fragment>
			<ScreenHeader>
				<UserListFilter onChange={ setQuery } />
			</ScreenHeader>
			{ data.query &&
				<UserList
					query={ query }
					pagination={ true }
				/>
			}
		</Fragment>
	)
}

registerApp( 'fl-users', {
	label: 'Users',
	content: () => <UsersTab />,
} )
