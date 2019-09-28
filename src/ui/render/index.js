import React from 'fl-react'
import { render } from 'fl-react-dom'
import { Assistant } from '../main'

// Render App into the document
const root = document.createElement( 'div' )
root.classList.add( 'fl-asst' )
document.body.appendChild( root )

render( <Assistant />, root )
