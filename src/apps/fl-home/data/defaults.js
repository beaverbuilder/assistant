import { __ } from '@wordpress/i18n'

export const defaultPageKey = 'home'

export const defaultPage = {
	label: __( 'Home' ),
	isEditable: true,
	cards: [
		{
			id: '465484684',
			type: 'fl-tile-grid',
			title: false,
		},
		{
			id: '98372934729',
			type: 'fl-query',
		},
		{
			id: 'lksjdlfkjsdf',
			type: 'fl-shortcuts',
			title: false,
		},
		{
			id: '092u30909',
			type: 'fl-apps',
		},
	],
}


export const defaultCard = {
	title: null,
	content: null,
	type: defaultCardTypeKey,
}

export const defaultCardTypeKey = 'fl-card'

export const defaultCardType = {
	label: __( 'Generic Card' ),
	allowMultiple: true,
	edit: () => null,
	render: () => null,
}
