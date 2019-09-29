import {
	React,
	ReactDOM,
	ReactRouter,
	Redux,
	PropTypes,
	classnames
} from '@beaverbuilder/vendors'

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
