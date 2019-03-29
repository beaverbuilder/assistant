import React, { useContext, useState } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { AspectBox, ItemContext, ViewContext, StackContext } from 'components'
import { MediaDetail } from './detail'

export const MediaListItem = ( { className } ) => {
	const item = useContext( ItemContext )
	const { sizes } = item
	const { present } = useContext( StackContext )
	const [ orientation, setOrientation ] = useState( 'square' )

	const classes = classname( {
		'fl-asst-grid-item': true,
		[`fl-asst-grid-item-${orientation}`]: orientation
	}, className )

	const onImageLoaded = e => {
		const img = e.target
		if ( img.naturalWidth === img.naturalHeight ) {
			setOrientation( 'square' )
		} else if ( img.naturalWidth >= ( img.naturalHeight * 1.75 ) ) {
			setOrientation( 'pano' )
		} else if ( img.naturalHeight >= ( img.naturalWidth * 2 ) ) {
			setOrientation( 'skyscraper' )
		} else if ( img.naturalWidth < img.naturalHeight ) {
			setOrientation( 'portrait' )
		} else if ( img.naturalWidth > img.naturalHeight ) {
			setOrientation( 'landscape' )
		}
	}
	let url = null
	if ( 'undefined' !== typeof sizes ) {
		if ( 'undefined' !== typeof sizes.medium_large ) {
			url = sizes.medium_large.url
		} else if ( 'undefined' !== typeof sizes.medium ) {
			url = sizes.medium.url
		}
	}

	const onClick = () => {
		const context = { ...item }
		present({
			label: __('Edit Media'),
			content: (
				<ViewContext.Provider value={context}>
					<MediaDetail />
				</ViewContext.Provider>
			)
		})
	}

	return (
		<figure className={classes} onClick={onClick}>
			<img
				src={url}
				onLoad={onImageLoaded}
			/>
		</figure>
	)
}

export const MediaListItemLoading = ( { className } ) => {
	const classes = classname( className, 'fl-asst-grid-item' )
	const styles = {
		flex: '1 1 50%'
	}

	return (
		<div className={classes} style={styles}>
			<div className="fl-asst-grid-item-anchor">
				<AspectBox />
			</div>
		</div>
	)
}
