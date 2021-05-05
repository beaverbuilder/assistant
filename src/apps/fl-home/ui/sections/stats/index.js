import React, { useState, useLayoutEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout, Icon } from 'assistant/ui'
import { useSystemState, getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import Section, { Swiper } from '../generic'
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
				<div className="home-currently-viewing-eyebrow">{ intro }</div>
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
								<Icon.Beaver size={ 30 } />
							</Button>
						)
					case 'detail':
						return (
							<Button { ...btn } disabled={ null === item }>
								<Icon.View />
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
	const { currentPageView } = getSystemConfig()
	const { name, screenshot, team, version } = currentPageView.theme

	return (
		<div className="fl-asst-swiper-item home-theme-card">
			<div style={ { width: 100 } }>
				<Layout.AspectBox
					ratio="4:3"
					style={ {
						background: `url(${screenshot})`,
						backgroundSize: 'cover',
					} }
				/>
			</div>
			<div>Theme</div>
			<div>{ name }</div>
			<div>Version: { version }</div>
		</div>
	)
}

export default StatsSection
