import React from 'fl-react'
import { render } from 'fl-react-dom'
import { Main } from '../main'

// Style Guide
import { renderGuide } from 'shared-lib'

//renderGuide()

// Render App into the document
const root = document.createElement( 'div' )
root.classList.add( 'fl-asst' )
document.body.appendChild( root )

render( <Main />, root )
