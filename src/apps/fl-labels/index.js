import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App } from './app'
import Icon from './icon'

registerApp( 'fl-labels', {
	label: __( 'Labels' ),
	root: App,
	icon: Icon,
} )
