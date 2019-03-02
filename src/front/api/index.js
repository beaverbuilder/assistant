import React from 'react'
import classname from 'classnames'
import * as components from 'components'
import * as store from 'store'
const { registerApp } = store.getSystemActions()

window.FLAssistant = {
    React,
    classname,
    components,
    store,
    registerApp,
}
