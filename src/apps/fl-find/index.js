import { __ } from '@wordpress/i18n'
import { getSystemActions } from 'store'
import { App, AppIcon, NewApp } from './app'
import { initialState, actions, reducers, effects } from './state'

const { registerApp } = getSystemActions()

registerApp( 'fl-find', {
	label: __( 'Content' ),
	content: App,
	icon: AppIcon,
	state: initialState,
	actions,
	reducers,
	effects,
	shouldShowTitle: false,

	newContent: NewApp,
	accentColor: {
		color: '#3AA4CC',
	}
} )
