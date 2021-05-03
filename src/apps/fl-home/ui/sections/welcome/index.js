import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import { Text } from 'assistant/ui'
import { useResizeObserver } from 'assistant/utils/react'
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
	const { ref, width } = useResizeObserver()
	const threshold = 490
	const bgFilename = width >= threshold ? 'laptop-girl-med.png' : 'laptop-girl-slim.png'
	const bgLeft = width >= threshold ? 250 : 230
	return (
		<div
			className="home-pro-banner"
			ref={ ref }
			style= { {
				backgroundImage: `url( ${imgURL}/${bgFilename} )`,
				backgroundPosition: `${bgLeft}px bottom`
			} }
		>
			<img className="pro-logo" src={ `${imgURL}/pro-branding-sm.png` } />
			<div>
				<Text.Title style={ { marginTop: 20, fontSize: 18, fontWeight: 'bold' } }>{ __( 'Try Assistant Pro' ) }</Text.Title>
				<p style={ { margin: 0, marginTop: 10, fontSize: 15, marginRight: 150, maxWidth: 200 } }>
					{ __( 'Get access to all your templates and assets on all your sites' ) }
				</p>
			</div>
		</div>
	)
}

export default WelcomeSection
