import { __ } from '@wordpress/i18n'
import React, { useEffect, useState } from 'fl-react'
import { getSystemConfig } from 'assistant/data'
import { Page, Button } from 'assistant/lib'
import { getWpRest } from 'assistant/utils/wordpress'
import { CancelToken } from 'axios'

import { Summary } from '../components/user/summary'
import { GeneralTab } from '../components/user/general'
import { PreferencesTab } from '../components/user/preferences'
import { PostsTab } from '../components/user/posts'

export const User = ( { match } ) => {

	const wordpress = getWpRest()
	const userId = match.params.id

	const { currentUser } = getSystemConfig()

	const [ loading, setLoading ] = useState( false )
	const [ user, setUser ] = useState( {} )
	const [ title, setTitle ] = useState( __( 'User Profile' ) )
	const [ currentTab, setCurrentTab ] = useState( 0 )

	const source = CancelToken.source()

	useEffect( () => {

		setLoading( true )
		wordpress.users().findById( userId, { cancelToken: source.token } )
			.then( ( response ) => {
				setUser( response.data )
				setLoading( false )
			} )

		if ( parseInt( userId ) === parseInt( currentUser.id ) ) {
			setTitle( __( 'Your Profile' ) )
		}

		return () => {
			source.cancel()
		}

	}, [] )

	const showTab = ( tabIndex ) => {
		switch ( tabIndex ) {
		case 2:
			return ( <PostsTab user={ user }/> )
		case 1:
			return ( <PreferencesTab user={ user }/> )
		case 0:
		default:
			return ( <GeneralTab user={ user }/> )
		}
	}

	return (
		<Page shouldPadSides={ loading } title={ title }>
			{ loading && <p>{__( 'Loading...' )}</p> }
			{ !loading && <>
				<Summary user={ user }/>
				<Button.Group>
					<Button isSelected={ 0 == currentTab } onClick={ () => setCurrentTab( 0 ) }>{__( 'General' )}</Button>
					<Button isSelected={ 1 == currentTab } onClick={ () => setCurrentTab( 1 ) }>{__( 'Preferences' )}</Button>
					<Button isSelected={ 2 == currentTab } onClick={ () => setCurrentTab( 2 ) }>{__( 'Posts' )}</Button>
				</Button.Group>
				{showTab( currentTab )}
			</> }
		</Page>
	)
}
