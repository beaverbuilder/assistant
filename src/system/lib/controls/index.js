import React from 'fl-react'
import { ToggleControl } from './toggle'
import { URLControl } from './url'

export const Control = props => <input { ...props } />

Control.Toggle = ToggleControl
Control.Toggle.displayName = 'Control.Toggle'

Control.URL = URLControl
Control.URL.displayName = 'Control.URL'
