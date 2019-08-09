import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils/url'
import { Page } from 'assistant/ui'
import { Users } from './app'

registerApp( 'fl-users', {
	label: __( 'Users' ),
	root: Users,
	icon: Users.Icon,
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
		format: response => {
			return response.map( result => ( {
				label: result.displayName,
			} ) )
		},
		detail: item => {
			return {
				component: Page.User,
				path: '/user/:id',
				pathname: `/user/${ item.id }`,
			}
		},
	},
} )
