import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactRouter from 'react-router-dom'
import * as Redux from 'redux'

export {
	React,
	ReactDOM,
	ReactRouter,
}

const api = window.FL || {}

window.FL = {
	...api,
	React,
	ReactDOM,
	ReactRouter,
	Redux,
}
