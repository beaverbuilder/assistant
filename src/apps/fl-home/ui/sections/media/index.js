import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import c from 'classnames'
import { Button } from 'assistant/ui'
import { getSystemConfig, useSystemState } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import Section, { Swiper } from '../generic'
import './style.scss'

const MediaSection = () => {
	const minItems = 12
	const { attachmentTypes } = getSystemConfig()
	const placeholders = Array( minItems ).fill( null, 0, minItems )
	const { attachments } = getWpRest()
	const [ images, setImages ] = useState( placeholders )
	const [ type, setType ] = useState( 'image' )
	const query = {
		post_mime_type: type,
		posts_per_page: 36
	}

	useEffect( () => {
		attachments().findWhere( query ).then( ( { data } ) => {
			if ( data.items ) {

				let dummies = []
				if ( minItems > data.items.length ) {
					const dummyCount = minItems - data.items.length
					dummies = Array( dummyCount ).fill( null, 0, dummyCount )
				}
				setImages( [ ...dummies, ...data.items ] )
			}
		} )
	}, [ type ] )

	const HeaderActions = () => (
		<>
			<Button to="/fl-media" appearance="transparent">{ __( 'Media App' ) }</Button>
		</>
	)

	return (
		<Section
			title={ __( 'Media' ) }
			headerActions={ <HeaderActions /> }
			padContent={ false }
		>
			<Swiper>
				<MediaGrid
					images={ images }
					type={ type }
					types={ Object.entries( attachmentTypes ) }
					setType={ setType }
				/>
			</Swiper>
		</Section>
	)
}

const MediaGrid = ( {
	images = [],
	type = 'image',
	types = [],
	setType = () => {}
} ) => {
	const { counts } = useSystemState( 'counts' )

	return (
		<div className="media-section-grid">

			<ul className="media-grid-nav">
				{ types.map( ( [ handle, label ] ) => {

					if ( 'all' === handle ) {
						return null
					}

					let count = 0
					if ( undefined !== counts[`attachment/${handle}`] ) {
						count = counts[`attachment/${handle}`]
					}

					return (
						<li key={ handle }>
							<button
								className={ c( { 'is-selected': type === handle } ) }
								onClick={ () => setType( handle ) }
							>
								<span className="media-grid-type-label">{ label }</span>
								<span className="media-grid-type-count">{ count }</span>
							</button>
						</li>
					)
				} ) }
			</ul>

			{ images.map( ( img, i ) => {

				// Loading placeholder
				if ( null === img ) {
					return (
						<div />
					)
				}

				const src = ( 'sizes' in img && 'medium' in img.sizes ) ? img.sizes.medium.url : img.url
				return (
					<div
						key={ i }
						className="media-grid-item"
						style={ {
							backgroundImage: `url( ${src} )`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						} }
					/>
				)
			} ) }
		</div>
	)
}

export default MediaSection
