import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layout } from 'assistant/ui'
import { getSrcSet } from 'assistant/utils/image'
import Image from './art'

const filterSizes = sizes => {
	const smallSizes = {}
	const allow = [ 'thumbnail', 'medium' ]
	for ( let key in sizes ) {
		if ( allow.includes( key ) ) {
			smallSizes[key] = sizes[key]
		}
	}
	return smallSizes
}

export const AttachmentItem = props => {
	const {
		thumbnail,
		type,
		subtype,
		alt,
		title,
		sizes,
		id,
		isTrashed,
		onClick = () => {}
	} = props
	const isDocument = ( 'application' === type || ( 'pdf' === subtype && ! thumbnail ) )

	// Filter down to just the smaller sizes for srcset
	const smallSizes = filterSizes( sizes )
	const to = isTrashed ? '' : {
		pathname: `/fl-media/attachment/${id}`,
		state: { item: props }
	}

	return (
		<Link to={ to } onClick={ onClick }>
			<motion.div className="fl-asst-media-item-box" layoutId={ `thumbnail-${id}` } >
				{ ( 'image' === type || 'pdf' === subtype ) && thumbnail && (
					<img
						src={ thumbnail }
						srcSet={ getSrcSet( smallSizes ) }
						alt={ alt }
						title={ title }
						loading="lazy"
					/>
				) }
				{ 'video' === type && <Image.Video /> }
				{ 'audio' === type && <Image.Audio /> }
				{ isDocument && <Image.Doc /> }
			</motion.div>
		</Link>
	)
}

export const PlaceholderItem = () => {
	return (
		<Layout.AspectBox />
	)
}

export const UploadingItem = ( { ...rest } ) => {
	return (
		<Layout.AspectBox>
			<img { ...rest } />
			<div style={ { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' } }>
				<Layout.Loading style={ { margin: 'auto' } } />
			</div>
		</Layout.AspectBox>
	)
}
