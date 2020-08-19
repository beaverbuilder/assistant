import React from 'react'
import { TagGroup, Tag } from './tag-group'

const Control = props => <input { ...props } />

Control.TagGroup = TagGroup
Control.Tag = Tag

export default Control
