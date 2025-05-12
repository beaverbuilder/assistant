import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { useSystemState, getSystemConfig, useAppState } from 'assistant/data'
import { Page, Text, Icon } from 'assistant/ui'
import { ConnectButton } from './ui'

export default ( { baseURL } ) => {
	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )
	const { isBBExtension } = getSystemConfig()

	if ( isCloudConnected ) {
		isBBExtension ? history.replace( '/bbapp' ) : history.replace( '/libraries' )
		return null
	}

	return (
		<Switch>
			<Route path={ baseURL } component={ Main } />
		</Switch>
	)
}

const Banner = () => {
	const { pluginURL, isBBExtension } = getSystemConfig()
	return (
		<div style={ { backgroundColor: 'var(--fl-brand-tan)' } }>
			<div
				style={ {
					backgroundImage: isBBExtension ? `url(${pluginURL}/img/apps/cloud-connect/template-cloud.png)` : `url(${pluginURL}/img/apps/cloud-connect/pro-banner-large.png)`,
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
		const src = isBBExtension ? 'site' : 'plugin'
		const redirect = encodeURIComponent( window.parent.location.href )
		window.parent.location.href = `${ cloudConfig.appUrl }/login/connect?redirect=${ redirect }&src=${ src }`
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
					padding: '30px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					maxWidth: '60ch',
					margin: '40px',
					background: 'var(--fluid-box-background)',
					borderRadius: 'var(--fluid-med-radius)'
				} }
			>
				{ isBBExtension &&
					<>
						<Text.Title style={ { fontSize: 20 } }>{ __( 'Connect to the Cloud' ) }</Text.Title>
						<p style={ { textAlign: 'center' } }>{__( 'Share row and layout templates between all your sites.' )}</p>
						<ConnectButton onClick={ connect }>{ __( 'Connect' ) }</ConnectButton>
					</>
				}
				{ ! isBBExtension &&
					<>
						<Text.Title style={ { fontSize: 20 } }>{ __( 'Introducing Assistant Pro' ) }</Text.Title>
						<p style={ { marginBottom: 30 } }>{__( 'Assistant Pro joins your WordPress sites together and allows you to sync creative assets, posts and layouts between them. To use libraries, you’ll need an Assistant Pro account.' )}</p>
						<ConnectButton onClick={ connect }>{ __( 'Connect to Pro' ) }</ConnectButton>
					</>
				}

			</div>
		</Page>
	)
}
