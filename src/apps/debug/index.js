import { registerApp } from 'assistant'
import { App } from './app'

registerApp( 'fl-debug', {
	label: 'Debug',
	root: App,
} )
