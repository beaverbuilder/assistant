import * as store from './store'
import * as ui from './ui'

import * as ReactRouter from 'react-router-dom'
import * as Redux from 'redux'
import * as classnames from 'classnames'
import * as camelcase from 'camelcase'

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
