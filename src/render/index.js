import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { Assistant, getAssistantBBPanelConfig } from './main'
import { __ } from '@wordpress/i18n'
import { getSystemActions } from 'assistant/data'
import { Icon } from 'assistant/ui'
import './admin-bar-item'
import './style.scss'

let mountNode = undefined

const unmountAssistant = () => undefined !== mountNode && unmountComponentAtNode( mountNode )

const renderNormal = () => {

	if ( undefined === mountNode ) {
		mountNode = document.createElement( 'div' )
		mountNode.classList.add( 'fl-asst-mount', 'fl-asst', 'fluid', 'fl', 'uid' )
		document.body.appendChild( mountNode )
	}

	render( <Assistant />, mountNode )
}

// In Beaver Builder?
if ( 'FLBuilder' in window ) {

	if ( 'domReady' in wp ) {
		wp.domReady( () => {

			// Listen for BB publish out (without refresh) and render standalone assistant
			FLBuilder.addHook( 'endEditingSession', renderNormal )

			// Listen for BB re-enter editing and ummount standalone assistant
			FLBuilder.addHook( 'restartEditingSession', unmountAssistant )

			// Setup Assistant panel in Beaver Builder
			if ( 'Builder' in FL && 'registerApp' in FL.Builder ) {

				const { registerApp, toggleAppsPanel } = FL.Builder

				registerApp( 'fl-assistant', getAssistantBBPanelConfig() )

				// Setup Trigger Button
				const button = document.querySelector( '.fl-builder-fl-assistant-button' )
				button.addEventListener( 'click', () => toggleAppsPanel() )
			}

		} )
	}
} else {

	// Render the standard Assistant app - We're not in Beaver Builder
	wp.domReady( renderNormal )
}

// Gutenberg more menu link
if ( wp && 'plugins' in wp ) {
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
