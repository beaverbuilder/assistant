import React from 'react'
import ReactDOM from 'react-dom'

export {
    React,
    ReactDOM,
}

const api = window.FL || {}

window.FL = {
    ...api,
    React,
    ReactDOM,
}
