import * as ReactRouter from 'react-router-dom'
import * as Redux from 'redux'
import classnames from 'classnames'
import camelcase from 'camelcase'

import * as store from './store'
import * as ui from './ui'

const FLUID = {
    store,
    ui,
    vendors: {
        ReactRouter,
        Redux,
        classnames,
        camelcase,
    }
}

export default FLUID
