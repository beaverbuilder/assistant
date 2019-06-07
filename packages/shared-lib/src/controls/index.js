import React from 'fl-react'
import { ToggleControl } from './toggle'

export const Control = props => <input {...props} />

Control.Toggle = ToggleControl
Control.Toggle.displayName = 'Control.Toggle'
