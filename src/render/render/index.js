import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { Assistant, getAssistantBBPanelConfig } from '../main'

let mountNode = undefined

const renderNormal = () => {

	if ( 'undefined' === typeof mountNode ) {
		mountNode = document.createElement( 'div' )
		mountNode.classList.add( 'fl-asst', 'fl-asst-mount-node' )
		document.body.appendChild( mountNode )
	}

	render( <Assistant />, mountNode )
}

const unmountAssistant = () => {
	if ( 'undefined' !== typeof mountNode ) {
		unmountComponentAtNode( mountNode )
	}
}

if ( 'FLBuilder' in window ) {

	if ( 'domReady' in wp ) {
		wp.domReady( () => {

			// Listen for BB publish out (without refresh)
			FLBuilder.addHook( 'endEditingSession', renderNormal )

			// Listen for BB re-enter editing
			FLBuilder.addHook( 'restartEditingSession', unmountAssistant )

			// Setup Builder Panel
			if ( 'Builder' in FL && 'registerPanel' in FL.Builder && 'togglePanel' in FL.Builder ) {

				const { registerPanel, togglePanel } = FL.Builder

				registerPanel( 'fl/assistant', getAssistantBBPanelConfig() )

				// Setup Trigger Button
				const button = document.querySelector( '.fl-builder-fl-assistant-button' )

				button.addEventListener( 'click', () => togglePanel( 'fl/assistant' ) )
			}

		} )
	}
} else {

	// Render the standard Assistant app - We're not in Beaver Builder
	renderNormal()
}
