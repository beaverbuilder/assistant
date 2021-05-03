import React, { useState, useEffect } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import c from 'classnames'
import { Button, Media, Icon } from 'assistant/ui'
import { getSystemConfig, useSystemState } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import Section, { Swiper } from '../generic'
import Art from './art'
import './style.scss'

/**
 * Pads the end of an array with null items to ensure there is always a minimum total items.
 */
const padWidthDummieItems = ( items = [], minItems = 12 ) => {
	let dummies = []
	if ( minItems > items.length ) {
		const dummyCount = minItems - items.length
		dummies = Array( dummyCount ).fill( null, 0, dummyCount )
	}
	return [ ...items, ...dummies ]
}

const MediaSection = ( { ...rest } ) => {
	const { attachmentTypes } = getSystemConfig()
	const { attachments } = getWpRest()
	const [ isLoading, setIsLoading ] = useState( true )
	const [ items, setItems ] = useState( [] )
	const [ type, setType ] = useState( 'image' )
	const { files: uploadingFiles = [], current: uploadingIndex } = Media.useMediaUploads()
	const query = {
		post_mime_type: type,
		posts_per_page: 36
	}

	useEffect( () => {
		attachments().findWhere( query ).then( ( { data } ) => {
			if ( data.items ) {
				setItems( [ ...data.items ] )
				setIsLoading( false )
			}
		} )
	}, [ type, uploadingIndex ] )

	const HeaderActions = () => <Button to="/fl-media" appearance="transparent">{ __( 'Media App' ) }</Button>

	return (
		<Section
			title={ __( 'Media' ) }
			headerActions={ <HeaderActions /> }
			padContent={ false }
			{ ...rest }
		>
			<Media.Uploader draggingView={ <HoverView /> }>
				<Swiper disabled={ isLoading }>
					<MediaGrid
						items={ padWidthDummieItems( [ ...uploadingFiles, ...items ] ) }
						type={ type }
						types={ Object.entries( attachmentTypes ) }
						setType={ setType }
					/>
				</Swiper>
			</Media.Uploader>
		</Section>
	)
}

const MediaGrid = ( {
	items = [],
	type = 'image',
	types = [],
	setType = () => {}
} ) => {
	const { counts } = useSystemState( 'counts' )
	const baseURL = '/fl-media'
	const allowedTypes = [ 'image', 'video' ]

	return (
		<div className="media-section-grid">

			<ul className="media-grid-nav">

				{ types.map( ( [ handle, label ] ) => {

					if ( ! allowedTypes.includes( handle ) ) {
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

			{ items.map( ( item, i ) => {

				// Loading placeholder
				if ( null === item ) {
					return (
						<div />
					)
				}

				// Handle files currently uploading
				if ( item instanceof File ) {
					return (
						<div
							src={ URL.createObjectURL( item ) }
							alt={ sprintf( 'Uploading %s', item.name ) }
							style={ {
								paddingTop: 0,
								filter: 'contrast(0.5) brightness(80%)',
								backgroundImage: `url( ${ URL.createObjectURL( item ) } )`,
								backgroundSize: 'cover',
								color: 'white'
							} }
						>
							<Icon.Loading />
						</div>
					)
				}

				const { type, subtype } = item
				const src = ( 'sizes' in item && 'medium' in item.sizes ) ? item.sizes.medium.url : item.url
				const classes = c( 'media-grid-item', {
					[`media-grid-item-type-${type}`]: type
				} )

				return (
					<Button
						key={ i }
						className={ classes }
						to={ {
							pathname: `${baseURL}/attachment/${item.id}`,
							state: { item }
						} }
						style={ {
							borderRadius: 0,
							backgroundImage: `url( ${src} )`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						} }
					>
						{ 'audio' === type && <Icon.Audio /> }
						{ 'video' === type && (
							<video src={ item.url }>
								<source type={ `video/${subtype}` } src={ item.url } />
							</video>
						) }
					</Button>
				)
			} ) }
		</div>
	)
}

const HoverView = () => {
	return (
		<div className="media-hover-display">
			{ __( 'You can just drop that anywhere' ) }
		</div>
	)
}

export default MediaSection
