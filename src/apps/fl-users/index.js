import { registerApp, __ } from 'assistant'
import { Users } from './app'

registerApp( 'fl-users', {
	label: __( 'Users' ),
	root: Users,
	icon: Users.Icon,
	accent: {
		color: '#FF5A5E'
	},
} )
