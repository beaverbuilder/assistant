import React, { useState, useLayoutEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout, Icon } from 'assistant/ui'
import { useSystemState, getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import Section, { Swiper } from '../generic'
import Beaver from './beaver'
import './style.scss'

const StatsSection = ( { ...rest } ) => {
	return (
		<Section
			title={ __( 'At A Glance' ) }
			className="home-stats-section"
			padContent={ false }
			{ ...rest }
		>
			<Swiper>
				<CurrentlyViewing />
				<Counts />
				<Theme />
			</Swiper>
		</Section>
	)
}

const useCurrentItem = () => {
	const wpRest = getWpRest()
	const { currentPageView } = getSystemConfig()
	const { id, isSingular, isAttachment } = currentPageView
	const [ item, setItem ] = useState( null )

	useLayoutEffect( () => {
		if ( isAttachment ) {
			wpRest.attachments().findById( id ).then( response => {
				setItem( response.data )
			} )

		} else if ( isSingular ) {
			wpRest.posts().findById( id ).then( response => {
				setItem( response.data )
			} )
		}
	}, [] )

	return item
}

const CurrentlyViewing = () => {
	const { currentPageView } = getSystemConfig()
	const { id, intro, name, actions: _actions, isSingular, isAttachment } = currentPageView
	const item = useCurrentItem()

	let actions = [ ..._actions ]

	if ( isSingular ) {
		let pathname = `/fl-content/post/${id}`

		if ( isAttachment ) {
			pathname = `/fl-media/attachment/${id}`
		}
		actions.push( {
			handle: 'detail',
			label: __( 'Edit Details' ),
			to: {
				pathname,
				state: { item }
			}
		} )
	}

	return (
		<div className="fl-asst-swiper-item home-currently-viewing">
			<div style={ { marginBottom: 10 } }>
				<div className="home-currently-viewing-eyebrow">
					<LocationPinIcon />
					{ intro }
				</div>
				<div className="home-currently-viewing-title">{ name }</div>
			</div>
			<div className="home-currently-viewing-actions">
				{ actions.map( ( { handle = '', label, isEnabled = true, ...rest }, i ) => {

					if ( ! isEnabled ) {
						return null
					}

					const btn = {
						key: i,
						title: label,
						shape: 'round',
						size: 'lg',
						...rest,
					}

					switch ( handle ) {
					case 'edit':
						return (
							<Button { ...btn } >
								<Icon.Edit />
							</Button>
						)
					case 'fl-builder':
						return (
							<Button { ...btn } >
								<Beaver />
							</Button>
						)
					case 'detail':
						return (
							<Button { ...btn } disabled={ null === item }>
								{ null === item ? <Icon.Loading /> : <Icon.ArrowRight /> }
							</Button>
						)
					default:
						return (
							<Button { ...btn } >
								{ label }
							</Button>
						)
					}

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

const Theme = () => {
	const { currentPageView, adminURLs } = getSystemConfig()
	const { name, screenshot, team, version } = currentPageView.theme

	if ( undefined === adminURLs.switchThemes ) {
		return null
	}

	return (
		<a href={ adminURLs.switchThemes } className="fl-asst-swiper-item home-theme-card" target="_blank" rel="noreferrer">
			<div className="theme-card-title">{ __( 'Active Theme' ) }</div>
			<div className="theme-details">
				<div className="theme-thumbnail">
					<Layout.AspectBox
						ratio="4:3"
						style={ {
							background: `url(${screenshot})`,
							backgroundSize: 'cover',
						} }
					/>
				</div>
				<div className="theme-meta">
					<div className="theme-title">{ name }</div>
					<div>Version: { version }</div>
					<div>Author: { team }</div>
				</div>
			</div>
		</a>
	)
}

const LocationPinIcon = ( { size = 20, ...rest } ) => {
	return (
		<svg width={ size } height={ size } viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" { ...rest }>
			<path d="M10.0078 15.6562C10.3672 15.6562 10.8984 14.3125 10.8984 12.3672V7.44531C12.2578 7.0625 13.2344 5.80469 13.2344 4.33594C13.2344 2.54688 11.8047 1.09375 10.0078 1.09375C8.21094 1.09375 6.77344 2.54688 6.77344 4.33594C6.77344 5.80469 7.75781 7.05469 9.10156 7.44531V12.3672C9.10156 14.3047 9.64062 15.6562 10.0078 15.6562ZM9.09375 4.52344C8.50781 4.52344 7.99219 4 7.99219 3.40625C7.99219 2.80469 8.50781 2.30469 9.09375 2.30469C9.70312 2.30469 10.1953 2.80469 10.1953 3.40625C10.1953 4 9.70312 4.52344 9.09375 4.52344ZM10 18.9062C15.1719 18.9062 18.3516 17.2031 18.3516 15.1172C18.3516 12.9844 15.1719 11.5625 12.2734 11.3828V12.9766C14.2031 13.1016 16.4062 13.8906 16.4062 14.9922C16.4062 16.3359 13.7188 17.25 10 17.25C6.27344 17.25 3.58594 16.3438 3.58594 14.9922C3.58594 13.8906 5.79688 13.1016 7.71875 12.9766V11.3828C4.82812 11.5625 1.64844 12.9844 1.64844 15.1172C1.64844 17.2031 4.82812 18.9062 10 18.9062Z" fill="currentColor" />
		</svg>
	)
}

export default StatsSection
