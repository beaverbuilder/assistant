import React from 'react'
import { __ } from '@wordpress/i18n'
import { Text } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import Section, { Swiper } from '../generic'
import './style.scss'

const AppsSection = () => {
	const { pluginURL } = getSystemConfig()
	const imgURL = `${pluginURL}/img/apps/fl-home/`
	return (
		<Section
			className="fl-asst-apps-feature-section"
			title={ __( 'Get Started With Apps' ) }
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
				/>
				<Card
					headline={ <div><strong>Media</strong> At Your Fingertips</div> }
					subtext={ __( 'The media app lets you quickly upload and find attachment info no matter where you are.' ) }
					style={ {
						'--card-bg': 'var(--fl-brand-red)',
						backgroundImage: `url(${imgURL}media-card.png)`,
					} }
				/>
				<Card
					headline={ <div>Share <strong>Libraries</strong> across all your sites</div> }
					style={ {
						'--card-bg': 'var(--fl-brand-light-blue)',
						'--card-color': '#125F77', /* little darker than normal dark blue */
						backgroundImage: `url(${imgURL}libraries-card.png)`,
					} }
				/>
			</Swiper>
		</Section>
	)
}

const Card = ( { headline, subtext, ...rest } ) => {
	return (
		<div
			className="fl-asst-swiper-item"
			{ ...rest }
		>
			<div style={ { padding: '0 20px', minHeight: 80 } }>
				{ headline && <Text.Title>{headline}</Text.Title> }
				{ subtext && <p>{subtext}</p> }
			</div>
			<div className="card-bottom-toolbar">
			</div>
		</div>
	)
}

export default AppsSection
