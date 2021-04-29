import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Text } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import Section, { Swiper } from '../generic'
import './style.scss'

const GoToButton = ( { children, ...rest } ) => (
	<Button
		appearance="transparent"
		{ ...rest }
	>
		{ children }
		<Icon.ArrowRight style={ {  marginLeft: 8 } } />
	</Button>
)

const AppsSection = () => {
	const { pluginURL } = getSystemConfig()
	const imgURL = `${pluginURL}/img/apps/fl-home/`
	return (
		<Section
			className="fl-asst-apps-feature-section"
			title={ __( 'Get Started With Apps' ) }
			description={ __( 'Assistant apps give you quick access to some of your most frequent tasks.' ) }
			padContent={ false }
		>
			<Swiper>
				<Card
					headline={ <div>Find <strong>Content</strong> Fast</div> }
					subtext={ __( 'The content app lets you find posts, pages and more with lightning speed.' ) }
					style={ {
						'--card-bg': 'var(--fl-brand-dark-blue)',
						backgroundImage: `url(${imgURL}content-card.png)`,
					} }
					footer={ <GoToButton to="/fl-content">{ __( 'Go To Content App' ) }</GoToButton> }
				/>
				<Card
					headline={ <div><strong>Media</strong> At Your Fingertips</div> }
					subtext={ __( 'The media app lets you quickly upload and find attachment info no matter where you are.' ) }
					style={ {
						'--card-bg': 'var(--fl-brand-red)',
						backgroundImage: `url(${imgURL}media-card.png)`,
					} }
					footer={ <GoToButton to="/fl-media">{ __( 'Go To Media App' ) }</GoToButton> }
				/>
				<Card
					headline={ <div>Share <strong>Libraries</strong> across all your sites</div> }
					style={ {
						'--card-bg': 'var(--fl-brand-light-blue)',
						'--card-color': '#125F77', /* little darker than normal dark blue */
						backgroundImage: `url(${imgURL}libraries-card.png)`,
					} }
					footer={ <GoToButton to="/libraries">{ __( 'Go To Libraries App' ) }</GoToButton> }
				/>
			</Swiper>
		</Section>
	)
}

const Card = ( { headline, subtext, footer, ...rest } ) => {
	return (
		<div
			className="fl-asst-swiper-item"
			{ ...rest }
		>
			<div className="card-content">
				{ headline && <Text.Title>{headline}</Text.Title> }
				{ subtext && <p>{subtext}</p> }
			</div>
			{ footer && <div className="card-bottom-toolbar">{footer}</div> }
		</div>
	)
}

export default AppsSection
