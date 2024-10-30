import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { useSystemState, getSystemConfig, useAppState } from 'assistant/data'
import { Page, Text, Icon } from 'assistant/ui'
import { ConnectButton } from './ui'

export default ( { baseURL } ) => {
	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	if ( isCloudConnected ) {
		history.replace( '/libraries' )
		return null
	}

	return (
		<Switch>
			<Route path={ baseURL } component={ Main } />
		</Switch>
	)
}

const Banner = () => {
	const { pluginURL } = getSystemConfig()
	return (
		<div style={ { backgroundColor: 'var(--fl-brand-tan)' } }>
			<div
				style={ {
					backgroundImage: `url(${pluginURL}/img/apps/cloud-connect/pro-banner-large.png)`,
					backgroundSize: 'cover',
					backgroundPosition: 'bottom center',
					paddingTop: 'clamp( 200px, 65%, 303px)',
					maxWidth: 672,
				} }
			/>
		</div>
	)
}

const Main = () => {
	const { cloudConfig, isBBExtension } = getSystemConfig()
	const { isValidating } = useAppState( 'fl-cloud-connect' )

	if ( isValidating ) {
		return <Page.Loading />
	}

	const connect = () => {
		const redirect = encodeURIComponent( window.parent.location.href )
		window.parent.location.href = `${ cloudConfig.appUrl }/login/connect?redirect=${ redirect }`
	}

	return (
		<Page
			className='fl-asst-connect-layout'
			title={ __( 'Connect to Assistant Pro' ) }
			icon={ <Icon.Library /> }
			shouldShowBackButton={ false }
			toolbar={ false }
			padX={ false }
			padY={ false }
		>
			<Banner />

			<div
				style={ {
					padding: 40,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					maxWidth: '60ch',
					margin: '0 auto'
				} }
			>
				{ isBBExtension &&
					<>
						<Text.Title style={ { fontSize: 20 } }>{ __( 'Beaver Builder Cloud' ) }</Text.Title>
						<Text.Title style={ { fontSize: 14, marginTop: '5px' } }>{ __( 'Powered by Assistant Pro' ) }</Text.Title>
						<p style={ { marginBottom: 30 } }>{__( 'Beaver Builder Cloud joins your WordPress sites together and allows you to sync creative assets, posts and layouts between them.' )}</p>
						<ConnectButton onClick={ connect }>{ __( 'Connect to Cloud' ) }</ConnectButton>
					</>
				}
				{ ! isBBExtension &&
					<>
						<Text.Title style={ { fontSize: 20 } }>{ __( 'Introducing Assistant Pro' ) }</Text.Title>
						<p style={ { marginBottom: 30 } }>{__( 'Assistant Pro joins your WordPress sites together and allows you to sync creative assets, posts and layouts between them. To use libraries, you’ll need an Assistant Pro account.' )}</p>
						<ConnectButton onClick={ connect }>{ __( 'Connect to Pro' ) }</ConnectButton>
					</>
				}
				<div style={ { marginTop: 30 } }>
					<a href={ `${ cloudConfig.appUrl }/register` } target='blank'>
						{ __( 'Don\'t have an account? Register now!' ) }
					</a>
				</div>
			</div>
		</Page>
	)
}
