import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import { Text } from 'assistant/ui'
import Section from '../generic'
import './style.scss'

const WelcomeSection = () => {
	const { currentUser, pluginURL } = getSystemConfig()

	return (
		<Section
			title={ sprintf( 'Welcome, %s', currentUser.displayName ) }
			className="home-welcome-section"
			padContent={ false }
		>
			<ProBanner pluginURL={ pluginURL } />
		</Section>
	)
}

const ProBanner = ( { pluginURL } ) => {
	const imgURL = `${pluginURL}/img/apps/fl-home/`
	return (
		<div
			className="home-pro-banner"
			style= { {
				backgroundImage: `url( ${imgURL}/laptop-girl-slim.png )`
			} }
		>
			<img className="pro-logo" src={ `${imgURL}/pro-branding-sm.png` } />
			<div>
				<Text.Title style={ { marginTop: 20, fontSize: 18, fontWeight: 'bold' } }>{ __( 'Try Assistant Pro' ) }</Text.Title>
				<p style={ { margin: 0, marginTop: 10, fontSize: 15, marginRight: 150, maxWidth: 240 } }>
					{ __( 'Get access to all your templates and assets on all your sites' ) }
				</p>
			</div>
		</div>
	)
}

export default WelcomeSection
