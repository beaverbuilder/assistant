import * as ReactRouter from 'react-router-dom'
import * as Redux from 'redux'
import classnames from 'classnames'
import camelcase from 'camelcase'
import * as ReactLaag from 'react-laag'
import ResizeObserverPolyfill from 'resize-observer-polyfill'
import * as FramerMotion from 'framer-motion'

import * as data from './data'
import * as ui from './ui'
import * as utils from './utils'

const FLUID = {
	data,
	ui,
	utils,
	vendors: {
		ReactRouter,
		Redux,
		classnames,
		camelcase,
		ReactLaag,
		ResizeObserverPolyfill,
		FramerMotion,
	}
}

export default FLUID
