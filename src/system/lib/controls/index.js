import React from 'fl-react'
import { ToggleControl } from './toggle'
import { URLControl } from './url'
import { NextPrev } from './prev-next'
import { Code } from './code'

export const Control = props => <input { ...props } />

Control.Toggle = ToggleControl
Control.Toggle.displayName = 'Control.Toggle'

Control.URL = URLControl
Control.URL.displayName = 'Control.URL'

Control.NextPrev = NextPrev
Control.NextPrev.displayName = 'Control.NextPrev'

Control.Code = Code
Control.Code.displayName = 'Control.Code'
