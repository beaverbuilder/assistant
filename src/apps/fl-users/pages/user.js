import { __ } from '@wordpress/i18n'
import React, { useEffect, useState } from 'fl-react'
import { getSystemConfig } from 'assistant/data'
import { Page, Button, Nav } from 'assistant/lib'
import { getWpRest } from 'assistant/utils/wordpress'
import { CancelToken } from 'axios'

import { Summary } from '../components/user/summary'
import { GeneralTab } from '../components/user/general'
import { PreferencesTab } from '../components/user/preferences'
import { PostsTab } from '../components/user/posts'

export const User = ( { location, match, history } ) => {

	const { currentUser } = getSystemConfig()

	const isYou = ( currentUser.id === match.params.id )

	const [ loading, setLoading ] = useState( false )
	const [ user, setUser ] = useState( {
		id: null
	} )

	const source = CancelToken.source()

	const setTab = path => history.replace( path, location.state )

	const tabProps = {
		user,
		location,
		match,
		history,
	}

	const tabs = [
		{
			path: match.url,
			label: __( 'General' ),
			exact: true,
			component: () => ( <GeneralTab {...tabProps} /> ),
		},
		{
			path: match.url + '/preferences',
			label: __( 'Preferences' ),
			component: () => ( <PreferencesTab {...tabProps} /> ),
		},
		{
			path: match.url + '/posts',
			label: __( 'Posts' ),
			component: () => ( <PostsTab {...tabProps} /> ),
		}
	]

	const loadUser = async() => {
		setLoading( true )
		const config = { cancelToken: source.token }
		const response = await getWpRest().users().findById( match.params.id, config )
		setUser( response.data )
		setLoading( false )
	}

	useEffect( () => {
		loadUser()
		return () => source.cancel()
	}, [] )

	return (
		<Page shouldPadSides={ loading }
			title={ isYou ? __( 'Your Profile' ) : __( 'Edit User' ) }>
			{ loading && <p>{__( 'Loading...' )}</p> }
			{ ! loading && <>
				<Summary user={ user }/>
				<Button.Group>
					{tabs.map( ( { label, path }, i ) => (
						<Button key={ i }
							onClick={ () => setTab( path ) }
							isSelected={ path === location.pathname }
						>{label}</Button>
					) )}
				</Button.Group>


				<Nav.Switch>
					{tabs.map( ( tab, i ) => <Nav.Route key={ i } { ...tab } /> )}
				</Nav.Switch>
			</> }
		</Page>
	)
}
