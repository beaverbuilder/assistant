import React from 'react'
import { render } from 'react-dom'
import Assistant from './main'
import './style.scss'

const renderAdmin = () => {
    const node = document.querySelector('#fl-asst-admin-mount-node')
    if ( node ) {
        render( <Assistant />, node )
    }
}

renderAdmin()
