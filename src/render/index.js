import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'
import { Assistant, AssistantCore } from './main'
import renderSkipLink from './skip-link'
import './admin-bar-item'
import './style.scss'

let mountNode = undefined

const unmountAssistant = () => undefined !== mountNode && unmountComponentAtNode( mountNode )

const renderAssistant = () => {

	if ( undefined === mountNode ) {
		mountNode = document.createElement( 'div' )
		mountNode.classList.add( 'fl-asst-mount', 'fl-asst', 'fluid', 'fl', 'uid' )
		document.body.appendChild( mountNode )
	}
	render( <Assistant />, mountNode )
}

// In Beaver Builder?
if ( 'FLBuilder' in window ) {
	wp.domReady( () => {

		// Listen for BB publish out (without refresh) and render standalone assistant
		FLBuilder.addHook( 'endEditingSession', renderAssistant )

		// Listen for BB re-enter editing and ummount standalone assistant
		FLBuilder.addHook( 'restartEditingSession', unmountAssistant )

		// Setup Assistant panel in Beaver Builder
		if ( 'Builder' in FL && 'registerPanel' in FL.Builder ) {

			const { registerPanel, togglePanel } = FL.Builder

			registerPanel( 'assistant', {
				className: 'fl-asst fluid fl uid',
				label: __( 'Assistant' ),
				root: AssistantCore,
			} )

			// Setup Trigger Button
			const button = document.querySelector( '.fl-builder-fl-assistant-button' )
			button.addEventListener( 'click', () => togglePanel( 'assistant' ) )
		}

	} )
} else {

	// Render the standard Assistant app - We're not in Beaver Builder
	// Don't put this inside wp.domReady - things break.
	renderAssistant()
}

// Gutenberg more menu link
// Be aware this shows up on other gutenberg screens than just post editor (Widgets, Nav, etc...)
if ( wp && 'plugins' in wp && 'editPost' in wp ) {
	wp.plugins.registerPlugin( 'fl-asst-more-menu-item', {
		render: () => {
			const { PluginMoreMenuItem } = wp.editPost
			return (
				<PluginMoreMenuItem
					icon={ <Icon.Pencil /> }
					onClick={ FL.Assistant.toggleUI }
				>
					{ __( 'Assistant' ) }
				</PluginMoreMenuItem>
			)
		}
	} )
}

// Render skip link
renderSkipLink()
