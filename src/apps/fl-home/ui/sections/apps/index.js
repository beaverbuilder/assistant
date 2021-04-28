import React from 'react'
import Section, { Swiper } from '../generic'
import './style.scss'

const AppsSection = () => {
	return (
		<Section
			className="fl-asst-apps-feature-section"
			title="Get Started With Apps"
			padContent={ false }
		>
			<Swiper>
				<p className="fl-asst-swiper-item" style={ { background: 'var(--fl-brand-red)' } }>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod.</p>
				<p className="fl-asst-swiper-item" style={ { background: 'var(--fl-brand-yellow)' } }>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod.</p>
				<p className="fl-asst-swiper-item" style={ { background: 'var(--fl-brand-light-blue)' } }>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod.</p>
				<p className="fl-asst-swiper-item" style={ { background: 'var(--fl-brand-purple)' } }>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies vehicula ut id elit. Etiam porta sem malesuada magna mollis euismod.Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
			</Swiper>
		</Section>
	)
}

export default AppsSection
