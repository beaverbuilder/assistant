import React, { useState, useEffect } from 'fl-react'
import { Page } from 'assistant/lib'

import { getWpRest } from 'assistant/utils/wordpress'
import { getSystemConfig } from 'assistant/data'

import { CancelToken } from 'axios'

import { ProfileCard } from '../components/main/profile-card'
import { AvatarBar } from '../components/main/avatar-bar'

export const Main = () => {

	const [ users, setUsers ] = useState( [] )
	const { currentUser } = getSystemConfig()

	let source = CancelToken.source()

	useEffect( () => {

		getWpRest()
			.users()
			.findWhere( { number: 3 }, { cancelToken: source.token } )
			.then( ( response ) => {
				setUsers( response.data.items )
			} )

		return () => source.cancel()
	}, [] )

	return (
		<Page shouldPadSides={ true }>
			<ProfileCard user={ currentUser }/>
			<AvatarBar user={ currentUser } users={ users }/>
		</Page>
	)
}
