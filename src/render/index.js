import React from 'react'
import { render, createRoot, unmountComponentAtNode } from 'react-dom'
import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'
import { Assistant, AssistantBeaverBuilderIFrameUIRoot, AssistantBeaverBuilderPanel } from './main'
import renderSkipLink from './skip-link'
import './admin-bar-item'
import './style.scss'

const isAtLeastReact18 = parseInt( React.version.split('.')[0] ) >= 18
let mountNode = undefined
let root = undefined

const unmountAssistant = () => {
	if ( undefined !== root && isAtLeastReact18 ) {
		root.unmount()
	} else {
		unmountComponentAtNode( mountNode )
	}
}

const createMountNode = () => {
	mountNode = document.createElement( 'div' )
	mountNode.classList.add(
		'fl-asst-mount',
		'fl-asst',
		'fl-asst-plugin',
		'fluid',
		'fl',
		'uid'
	)
	mountNode.id = 'fl-asst-mount'
	return mountNode
}

/**
 * Render function for vanilla Assistant outside of Beaver Builder.
 */
const renderAssistant = () => {
	mountNode = document.getElementById( 'fl-asst-mount' )

	if ( ! mountNode ) {
		mountNode = createMountNode()
		document.body.appendChild( mountNode )
	} else {
		unmountAssistant()
	}

	if ( isAtLeastReact18 ) {
		root = createRoot( mountNode )
		root.render( <Assistant /> )
	} else {
		render( <Assistant />, mountNode )
	}
}

/**
 * Render function for Assistant inside Beaver Builder's iframe UI.
 */
const renderAssistantBBPanelIFrameUI = () => {

	const { registerPanel, togglePanel } = FL.Builder

	registerPanel( 'assistant', {
		wrapClassName: 'fl-asst',
		label: __( 'Assistant' ),
		root: AssistantBeaverBuilderIFrameUIRoot,
		frame: false,
		onMount: () => {
			mountNode = document.getElementById( 'fl-asst-mount' )

			if ( isAtLeastReact18 ) {
				root = createRoot( mountNode )
				root.render( <AssistantBeaverBuilderPanel /> )
			} else {
				render( <AssistantBeaverBuilderPanel />, mountNode )
			}
		},
		onUnMount: unmountAssistant
	} )

	// Setup Trigger Button
	const button = document.querySelector( '.fl-builder-fl-assistant-button' )
	if ( button ) {
		button.addEventListener( 'click', () => togglePanel( 'assistant' ) )
	}
}

/**
 * Render function for Assistant inside Beaver Builder's legacy UI.
 */
const renderAssistantBBPanel = () => {

	// Listen for BB publish out (without refresh) and render standalone assistant
	FLBuilder.addHook( 'endEditingSession', renderAssistant )

	// Listen for BB re-enter editing and ummount standalone assistant
	FLBuilder.addHook( 'restartEditingSession', unmountAssistant )

	// Setup Assistant panel in Beaver Builder
	if ( 'Builder' in FL && 'registerPanel' in FL.Builder ) {

		const { registerPanel, togglePanel } = FL.Builder

		registerPanel( 'assistant', {
			wrapClassName: 'fl-asst',
			label: __( 'Assistant' ),
			root: AssistantBeaverBuilderPanel,
			render: AssistantBeaverBuilderPanel, /* legacy */
			frame: false,
		} )

		// Setup Trigger Button
		const button = document.querySelector( '.fl-builder-fl-assistant-button' )
		if ( button ) {
			button.addEventListener( 'click', () => togglePanel( 'assistant' ) )
		}
	}
}

/**
 * Register vanilla Assistant or as a Beaver Builder panel.
 *
 * Assistant disables Beaver Builder's default frame and uses it's own.
 * The only big difference is that we override Assistant's isHidden state so BB can mount/unmount it.
 */
const builderFrame = document.getElementById( 'fl-builder-ui-iframe' )

if ( builderFrame ) {
	builderFrame.addEventListener( 'load', renderAssistantBBPanelIFrameUI )
} else if ( 'FLBuilder' in window ) {
	FLBuilder.addHook( 'didInitUI', renderAssistantBBPanel )
} else {

	// Render the standalone Assistant app - We're not in Beaver Builder
	// Don't put this inside wp.domReady() - things break.
	renderAssistant()
}

/**
 * Gutenberg more menu link
 * Be aware this shows up on other gutenberg screens than just post editor
 * (Ex. Widgets, Nav, etc...)
 */
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
