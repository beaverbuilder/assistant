import { __ } from '@wordpress/i18n'

export const state = {
	itemTypes: {
		post: {
			singular: __( 'Post' ),
			plural: __( 'Posts' ),
		},
		image: {
			singular: __( 'Image' ),
			plural: __( 'Images' ),
		},
		svg: {
			singular: __( 'SVG' ),
			plural: __( 'SVG' ),
		},
		color: {
			singular: __( 'Color' ),
			plural: __( 'Colors' ),
		},
	}
}

export const onMount = () => {
	// TODO: Preload teams here to cut down on requests.
	// TODO: Should we preload libraries here too?
}
