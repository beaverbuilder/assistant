import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App, AppIcon } from './app'
import { NewApp } from './new-app'
import { initialState, actions, reducers, effects } from './state'

registerApp( 'fl-find', {
	label: __( 'Content' ),
	content: App,
	icon: AppIcon,
	state: initialState,
	actions,
	reducers,
	effects,
	shouldShowTitle: false,

	root: NewApp,
	accentColor: {
		color: '#3AA4CC',
	}
} )
