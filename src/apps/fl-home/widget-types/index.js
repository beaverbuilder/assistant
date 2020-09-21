import React from 'react'
import { __ } from '@wordpress/i18n'
import { registerWidget } from 'assistant'
import { useSystemState, getSystemConfig } from 'assistant/data'
import CurrentlyViewing from './currently-viewing'
import Media from './media'
import './style.scss'

registerWidget( 'post-count', {
	title: __( 'Post Count' ),
	render: ( { settings } ) => {
		const { type = 'post' } = settings
		const { counts } = useSystemState()
		const config = getSystemConfig()
		const count = counts[`content/${type}`] ? counts[`content/${type}`] : 0
		const label = config.contentTypes[ type ].labels.plural

		return (
			<>
				<div className="post-count-total">{count}</div>
				<div>{label}</div>
			</>
		)
	}
} )

registerWidget( 'currently-viewing', {
	title: __( 'Currently Viewing' ),
	defaultSize: 'med',
	render: CurrentlyViewing
} )

registerWidget( 'media', {
	title: __( 'Media' ),
	defaultSize: 'sm',
	supportedSizes: [ 'sm' ],
	render: Media,
} )
