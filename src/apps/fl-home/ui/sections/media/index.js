import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from 'assistant/ui'
import { getWpRest } from 'assistant/utils/wordpress'
import Section from '../generic'
import './style.scss'

const MediaSection = () => {
	return (
		<Section
			title={ __( 'Media' ) }
			footer={ <Button to="/fl-media" appearance="transparent">{ __( 'Go to Media App' ) }</Button> }
		>
			<MediaGrid />
		</Section>
	)
}

const MediaGrid = () => {
	const { attachments } = getWpRest()
	const [ images, setImages ] = useState( [] )

	useEffect( () => {
		attachments().findWhere( { post_mime_type: 'image', posts_per_page: 8 } ).then( ( { data } ) => {
			if ( data.items ) {
				setImages( data.items )
			}
		} )
	}, [] )

	return (
		<div className="media-section-grid">
			{ images.map( ( img, i ) => {
				const src = ( 'sizes' in img && 'medium' in img.sizes ) ? img.sizes.medium.url : img.url
				return (
					<div
						key={ i }
						style={ {
							backgroundImage: `url( ${src} )`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'cover',
						} }
					/>
				)
			} ) }
		</div>
	)
}

export default MediaSection
