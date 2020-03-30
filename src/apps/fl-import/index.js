import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { ImportApp } from './app'


registerApp( 'fl-import', {
	label: __( 'Import' ),
	root: ImportApp,
	icon: ImportApp.Icon,
	accent: {
		color: '#FA9200'
	}
} )

