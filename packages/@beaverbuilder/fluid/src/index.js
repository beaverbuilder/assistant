import * as ReactRouter from 'react-router-dom'
import * as Redux from 'redux'
import classnames from 'classnames'
import camelcase from 'camelcase'

import * as data from './data'
import * as ui from './ui'

const FLUID = {
    data,
    ui,
    vendors: {
        ReactRouter,
        Redux,
        classnames,
        camelcase,
    }
}

export default FLUID
