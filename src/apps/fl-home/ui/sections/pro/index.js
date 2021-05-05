import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from 'assistant/ui'
import Section, { Swiper } from '../generic'
import './style.scss'

const ProSection = ( { ...rest } ) => {

	return (
		<Section
			title={ <TitleWithBadge /> }
			description={ __( 'Libraries let you collect your templates, images, and other assets and access them across all your sites.' ) }
			padContent={ false }
			isCollapsed={ true }
			footer={ (
				<>
					<Button appearance="transparent">View All</Button>
				</>
			) }
			{ ...rest }
		>
			<LibrariesGrid />
		</Section>
	)
}

const LibrariesGrid = () => {
	return (
		<Swiper className="pro-libraries-grid">
			<div className="fl-asst-swiper-item"></div>
			<div className="fl-asst-swiper-item"></div>
			<div className="fl-asst-swiper-item"></div>
			<div className="fl-asst-swiper-item"></div>
			<div className="fl-asst-swiper-item"></div>
			<div className="fl-asst-swiper-item"></div>
		</Swiper>
	)
}

const TitleWithBadge = () => (
	<>
		{ __( 'Libraries' ) }
		<svg width="39" height="22" viewBox="0 0 39 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={ { marginLeft: 10 } }>
			<rect width="38.7626" height="22" rx="5" fill="#EE521F"/>
			<path d="M6.88556 15.8365H8.6703V12.4986H10.4278C12.2398 12.4986 13.5068 11.1907 13.5068 9.31063C13.5068 7.43052 12.2398 6.16349 10.4278 6.16349H6V7.67575H6.88556V15.8365ZM8.6703 10.9728V7.67575H10.1281C11.109 7.67575 11.6812 8.31608 11.6812 9.31063C11.6812 10.3188 11.109 10.9728 10.1008 10.9728H8.6703Z" fill="white"/>
			<path d="M15.1344 15.8365H16.9192V12.2262H17.8184C18.3225 12.2262 18.5268 12.2943 18.7312 12.6757L19.971 15.1144C20.2843 15.7275 20.5977 15.8365 21.3197 15.8365H22.2598V14.3243H22.0827C21.783 14.3243 21.5513 14.297 21.4015 14.0109L20.4614 12.1444C20.2843 11.7902 19.9846 11.654 19.9846 11.654V11.6267C20.3933 11.545 21.5922 10.8229 21.5922 9.07902C21.5922 7.25341 20.3524 6.16349 18.5813 6.16349H14.2489V7.67575H15.1344V15.8365ZM16.9192 10.7003V7.67575H18.3633C19.2353 7.67575 19.7666 8.22071 19.7666 9.17439C19.7666 10.1417 19.2353 10.7003 18.3361 10.7003H16.9192Z" fill="white"/>
			<path d="M22.7626 10.9319C22.7626 13.7793 24.9152 16 27.7626 16C30.61 16 32.7626 13.7793 32.7626 10.9319C32.7626 8.16621 30.61 6 27.7626 6C24.9152 6 22.7626 8.16621 22.7626 10.9319ZM24.6155 10.9319C24.6155 9.07902 26.0187 7.66213 27.7626 7.66213C29.5065 7.66213 30.9097 9.07902 30.9097 10.9319C30.9097 12.8665 29.5065 14.3379 27.7626 14.3379C26.0187 14.3379 24.6155 12.8665 24.6155 10.9319Z" fill="white"/>
		</svg>
	</>
)

export default ProSection
