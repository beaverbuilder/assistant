import React from 'react'
import { Assistant } from './main'
import './style.scss'

if ( 'domReady' in wp ) {
    wp.domReady( () => {

        // Setup Builder Panel
        if ( 'Builder' in FL && 'registerPanel' in FL.Builder && 'togglePanel' in FL.Builder ) {

            const { registerPanel, togglePanel } = FL.Builder

            registerPanel( 'fl/assistant', {
                className: 'fl-asst',
                render: () => (
                    <Assistant />
                )
            })

            // Setup Trigger Button
            const button = document.querySelector('.fl-builder-fl-assistant-button')

            button.addEventListener( 'click', () => togglePanel( 'fl/assistant' ) )
        }

    })
}
