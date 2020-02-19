import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from 'assistant/utils/url'
import { currentUserCan } from 'assistant/utils/wordpress'
import { Page } from 'assistant/ui'
import { Users } from './app'

registerApp( 'fl-users', {
	label: __( 'People' ),
	root: Users,
	icon: Users.Icon,
	enabled: ! __PRODUCTION__ && currentUserCan( 'edit_users' ),
	accent: {
		color: '#7166EC'
	},
	search: {
		label: __( 'Users' ),
		priority: 200,
		route: ( keyword, number, offset ) => {
			return addQueryArgs( 'fl-assistant/v1/users', {
				search: `*${ keyword }*`,
				number,
				offset,
			} )
		},
		format: items => {
			return items.map( item => ( {
				...item,
				label: item.displayName,
			} ) )
		},
		detail: {
			component: Page.User,
			path: '/user/:id',
			pathname: item => {
				return `/user/${ item.id }`
			},
		},
	},
} )
