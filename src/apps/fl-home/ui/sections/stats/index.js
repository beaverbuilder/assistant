import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from 'assistant/ui'
import { useSystemState, getSystemConfig } from 'assistant/data'
import Section, { Swiper } from '../generic'
import './style.scss'

const StatsSection = () => {
	return (
		<Section
			title={ __( 'At A Glance' ) }
			className="home-stats-section"
			padContent={ false }
		>
			<Swiper>
				<CurrentlyViewing />
				<Counts />
			</Swiper>
		</Section>
	)
}

const CurrentlyViewing = () => {
	const { currentPageView } = getSystemConfig()
	const { intro, name, actions } = currentPageView
	return (
		<div className="fl-asst-swiper-item home-currently-viewing">
			<div>
				<div className="home-currently-viewing-eyebrow">{ intro }</div>
				<div className="home-currently-viewing-title">{ name }</div>
			</div>
			<div className="home-currently-viewing-actions">
				{ actions.map( ( { label, isEnabled = true, href }, i ) => {

					if ( ! isEnabled ) {
						return null
					}
					return (
						<Button
							key={ i }
							appearance="transparent"
							href={ href }
						>{ label }</Button>
					)
				} ) }
			</div>
		</div>
	)
}

const Counts = () => {
	const { counts } = useSystemState()
	const config = getSystemConfig()

	const stats = [
		{
			label: config.contentTypes.post.labels.plural,
			count: counts[ 'content/post' ] ? counts[ 'content/post' ] : 0
		},
		{
			label: __( 'Comments' ),
			count: counts[ 'comment/total' ] ? counts[ 'comment/total' ] : 0
		},
		{
			label: config.contentTypes.page.labels.plural,
			count: counts[ 'content/page' ] ? counts[ 'content/page' ] : 0
		},
		{
			label: __( 'Updates' ),
			count: counts[ 'update/total' ] ? counts[ 'update/total' ] : 0
		},
	]
	return (
		<div className="fl-asst-swiper-item home-stat-card">
			{ stats.map( ( { count, label }, i ) => (
				<div className="home-stat-count" key={ i }>
					<div className="home-stat-total">{ count }</div>
					<div className="home-stat-label">{ label }</div>
				</div>
			) ) }
		</div>
	)
}

export default StatsSection
