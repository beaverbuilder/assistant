import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'

export const defaultPageKey = 'home'

export const defaultPage = {
	label: __( 'Home' ),
	isEditable: true,
	cards: [
		{
			id: '465484684',
			type: 'fl-tile-grid',
		},
		{
			id: '98372934729',
			type: 'fl-query',
		},
		{
			id: 'lksjdlfkjsdf',
			type: 'fl-shortcuts',
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
