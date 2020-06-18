import * as ReactRouter from 'vendor-react-router-dom'
import * as classnames from 'vendor-classnames'
import * as FramerMotion from 'vendor-framer-motion'
import * as ReactLaag from 'vendor-react-laag'
import * as ResizeObserver from 'vendor-resize-observer-polyfill'
import * as Redux from 'vendor-redux'

// Ensure FL exists
window.FL = window.FL || {}
const existing = FL.vendors || {}

const vendors = {
    ReactRouter,
    Redux,
    FramerMotion,
    ReactLaag,
    ResizeObserver,
    classnames,
}

FL.vendors = {
    ...existing,
    ...vendors
}
