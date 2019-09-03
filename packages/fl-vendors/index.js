import * as React from './react'
import * as ReactDOM from './react-dom'

import * as ReactRouter from 'react-router-dom'
import * as Redux from 'redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const api = window.FL || {}
const existingVendors = api.vendors || {}

const vendors = {
	...existingVendors,
	React,
	ReactDOM,
	ReactRouter,
	Redux,
	PropTypes,
	classnames,
}

window.FL = {
	...api,
	vendors,
}
