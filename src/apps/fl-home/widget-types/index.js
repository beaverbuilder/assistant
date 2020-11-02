import { __ } from '@wordpress/i18n'
import { registerWidget } from 'assistant'
import CurrentlyViewing from './currently-viewing'
import Media from './media'
import RecentPosts from './recent-posts'
import Counts from './counts'
import Subscribe from './subscribe'
import Apps from './apps'

registerWidget( 'counts', {
	title: __( 'Counts' ),
	render: Counts,
	supportsSizes: [ 'sm' ],
	defaultSize: 'sm'
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
	supportsSizes: [ 'lg' ],
	defaultSize: 'lg'
} )

registerWidget( 'asst-email-signup', {
	title: __( 'Stay up-to-date with Assistant' ),
	render: Subscribe,
	supportsSizes: [ 'lg' ],
	defaultSize: 'lg'
} )

registerWidget( 'apps', {
	title: __( 'Apps' ),
	render: Apps,
	supportsSizes: [ 'lg' ],
	defaultSize: 'lg'
} )
