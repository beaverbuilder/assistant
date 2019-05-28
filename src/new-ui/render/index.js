import React from 'react'
import { render } from 'react-dom'
import { Main } from '../main'

// Render App into the document
const root = document.createElement( 'div' )
root.classList.add( 'fl-asst' )
document.body.appendChild( root )

render( <Main />, root )
