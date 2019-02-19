import store, { useDispatch } from 'store'

import './fl-testing'
import './fl-settings'
import './fl-media'
import './fl-users'
import './fl-find'
import './fl-dashboard'
import './fl-notifications'

// After apps get registered - store setup
const { setAppFrameSize } = useDispatch()
const { apps, activeApp } = store.getState()
const active = apps[ activeApp ]
setAppFrameSize( active.size )
