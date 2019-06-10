import { registerApp, __ } from 'assistant'
import { Cloud } from './app'

registerApp( 'fl-cloud', {
	label: __( 'Cloud' ),
	root: Cloud,
	icon: Cloud.Icon,
	accent: {
		color: '#FA9200'
	}
} )
