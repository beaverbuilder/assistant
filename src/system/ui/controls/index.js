import { Control } from '@beaverbuilder/forms'
import { ToggleControl } from './toggle'
import { URLControl } from './url'
import { NextPrev } from './prev-next'
import { CirclePicker } from './color-picker'

Control.Toggle = ToggleControl
Control.Toggle.displayName = 'Control.Toggle'

Control.URL = URLControl
Control.URL.displayName = 'Control.URL'

Control.NextPrev = NextPrev
Control.NextPrev.displayName = 'Control.NextPrev'

Control.CirclePicker = CirclePicker
Control.CirclePicker.displayName = 'Control.CirclePicker'

export default Control
