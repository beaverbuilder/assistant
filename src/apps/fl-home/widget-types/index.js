import { __ } from '@wordpress/i18n'
import { registerWidget } from 'assistant'
import CurrentlyViewing from './currently-viewing'
import Media from './media'
import RecentPosts from './recent-posts'
import Counts from './counts'
import './style.scss'

registerWidget( 'counts', {
	title: __( 'Counts' ),
	render: Counts
} )

registerWidget( 'currently-viewing', {
	title: __( 'Currently Viewing' ),
	render: CurrentlyViewing
} )

registerWidget( 'media', {
	title: __( 'Media' ),
	defaultSize: 'sm',
	supportsSizes: [ 'sm' ],
	render: Media,
} )

registerWidget( 'recent-posts', {
	title: __( 'Recent Posts' ),
	render: RecentPosts,
} )
