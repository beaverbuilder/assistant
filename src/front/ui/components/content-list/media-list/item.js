import React, { useContext } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { AspectBox, ItemContext, ViewContext, StackContext, Icon } from 'components'
import { MediaDetail } from './detail'

export const MediaListItem = ( { className } ) => {
	const item = useContext( ItemContext )
	const { sizes, title, alt } = item
	const { present } = useContext( StackContext )

	const classes = classname( {
		'fl-asst-grid-item': true,
	}, className )

	let url = null
	if ( 'undefined' !== typeof sizes ) {
		if ( 'undefined' !== typeof sizes.medium ) {
			url = sizes.medium.url
		} else if ( 'undefined' !== typeof sizes.thumbnail ) {
			url = sizes.thumbnail.url
		}
	}

	const onClick = () => {
		const context = { ...item }
		present( {
			label: __( 'Edit Media' ),
			content: (
				<ViewContext.Provider value={context}>
					<MediaDetail />
				</ViewContext.Provider>
			),
			appearance: 'form',
			shouldShowTitle: false,
		} )
	}

	/*
	const getMimeEnding = mime => {
		const parts = mime.split('/')
		return parts[ parts.length - 1 ]
	}*/

	return (
		<figure className={classes} onClick={onClick}>
			<div className="fl-asst-figure-visual">
				{ url && <img src={url} alt={alt} /> }
				{ ! url && <Icon name="document" /> }
			</div>
			<figcaption>{title}</figcaption>
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
