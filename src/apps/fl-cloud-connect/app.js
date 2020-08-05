import React, { useState } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { useSystemState, getSystemConfig } from 'assistant/data'
import { Page } from 'assistant/ui'
import { getQueryArgs, addQueryArgs } from 'assistant/utils/url'
import cloud from 'assistant/cloud'
import AppIcon from './icon'
import { ConnectCard, ConnectButton } from './ui'

export default ( { baseURL } ) => {
	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	if ( isCloudConnected ) {
		history.replace( '/fl-cloud-libraries' )
		return null
	}

	return (
		<Switch>
			<Route path={ baseURL } component={ Main } />
		</Switch>
	)
}

const Main = () => {
	const { cloudConfig } = getSystemConfig()
	const { href } = window.location
	const { token, ...args } = getQueryArgs( href )
	const [ isTokenValid, setIsTokenValid ] = useState( !! token )

	if ( token && isTokenValid ) {
		cloud.session.setToken( token )
		cloud.auth.refresh().then( response => {
			cloud.session.create( response.token, response.user, true )
			window.location.href = addQueryArgs( href.split( '?' ).shift(), args )
		} ).catch( () => {
			cloud.session.destroy()
			setIsTokenValid( false )
		} )
		return <Page.Loading />
	}

	const connect = () => {
		const redirect = encodeURIComponent( href )
		window.location.href = `${ cloudConfig.appUrl }/login/connect?redirect=${ redirect }`
	}

	return (
		<Page
			className='fl-asst-connect-layout'
			title={ __( 'Connect to Assistant Pro' ) }
			icon={ <AppIcon context='sidebar' /> }
			shouldShowBackButton={ false }
		>

			<p>{__( 'To use libraries, you’ll need an Assistant Pro account.' )}</p>

			<ConnectCard>
				<p>{__( 'Assistant Pro joins your WordPress sites together and allows you to sync creative assets, posts and layouts between them.' )}</p>
				<ConnectButton onClick={ connect }>
					{__( 'Get Connected' )}
				</ConnectButton>

				<div style={ { marginTop: 20 } }>
					<a href={ `${ cloudConfig.appUrl }/register` } target='blank'>
						{ __( 'Don\'t have an account? Register now!' ) }
					</a>
				</div>
			</ConnectCard>
		</Page>
	)
}
