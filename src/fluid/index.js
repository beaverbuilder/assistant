import {
	ReactRouter,
	Redux,
	PropTypes,
	classnames
} from '@beaverbuilder/vendors'

const api = window.FL || {}
const existingVendors = api.vendors || {}

const vendors = {
	...existingVendors,
	ReactRouter,
	Redux,
	PropTypes,
	classnames,
}

window.FL = {
	...api,
	vendors,
}


// TEMP - Import FL.UID Library
import '@beaverbuilder/fluid'
