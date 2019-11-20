import * as store from './store'
import * as ui from './ui'

import * as ReactRouter from 'react-router-dom'
import * as Redux from 'redux'
import * as classnames from 'classnames'

const FLUID = {
    store,
    ui,
    vendors: {
        ReactRouter,
        Redux,
        classnames
    }
}

export default FLUID
