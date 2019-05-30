import { getSystemActions } from 'store'
import { App } from './app'
const { registerApp } = getSystemActions()

registerApp('fl-debug', {
    label: 'Debug',
    root: App,
})
