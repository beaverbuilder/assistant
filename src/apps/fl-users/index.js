import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils'
import { Users } from './app'

registerApp( 'fl-users', {
	label: __( 'Users' ),
	root: Users,
	icon: Users.Icon,
	accent: {
		color: '#FF5A5E'
	},
	search: {
		label: __( 'Users' ),
		priority: 200,
		route: keyword => {
			return addQueryArgs( 'fl-assistant/v1/users', {
				search: `*${ keyword }*`,
			} )
		},
		format: response => {
			return response.map( result => ( {
				label: result.displayName,
			} ) )
		},
	},
} )
