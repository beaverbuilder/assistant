import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { Assistant, getAssistantBBPanelConfig } from './main'
import { __ } from '@wordpress/i18n'
import { getSystemActions } from 'assistant/data'
import './admin-bar-item'
import './style.scss'

let mountNode = undefined

const unmountAssistant = () => undefined !== mountNode && unmountComponentAtNode( mountNode )

const renderNormal = () => {

	if ( undefined === mountNode ) {
		mountNode = document.createElement( 'div' )
		mountNode.classList.add( 'fl-asst', 'fl-asst-mount-node' )
		document.body.appendChild( mountNode )
	}
	render( <Assistant />, mountNode )
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
	wp.domReady( renderNormal )
}

// Render skip link
if ( 'domReady' in wp ) {
	wp.domReady( () => {
		const { setWindow } = getSystemActions()

		const skip = document.createElement( 'button' )
		skip.classList.add( 'skip-link', 'fl-asst-screen-reader-text' )
		skip.innerText = __( 'Skip to Assistant' )
		skip.tabIndex = 1

		skip.addEventListener( 'click', () => {
			setWindow( { isHidden: false } )

			// Move focus
			const closeBtn = document.getElementById( 'fl-asst-close-panel' )
			closeBtn.focus()
		} )

		document.body.prepend( skip )
	} )
}
