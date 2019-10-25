import React from 'react'
import { ToggleControl } from './toggle'
import { URLControl } from './url'
import { NextPrev } from './prev-next'
import { TagGroup, Tag } from './tag-group'
import { CirclePicker } from './color-picker'
import { FilterBar } from './filter'

export const Control = props => <input { ...props } />

Control.Toggle = ToggleControl
Control.Toggle.displayName = 'Control.Toggle'

Control.URL = URLControl
Control.URL.displayName = 'Control.URL'

Control.NextPrev = NextPrev
Control.NextPrev.displayName = 'Control.NextPrev'

Control.Tag = Tag
Control.Tag.displayName = 'Control.Tag'

Control.TagGroup = TagGroup
Control.TagGroup.displayName = 'Control.TagGroup'

Control.CirclePicker = CirclePicker
Control.CirclePicker.displayName = 'Control.CirclePicker'

Control.FilterBar = FilterBar
Control.FilterBar.displayName = 'Control.FilterBar'
