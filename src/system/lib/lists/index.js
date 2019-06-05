import React, { Children, createElement } from 'fl-react'
import classname from 'classnames'

export const List = ({
        tag: Tag = 'ul',
        childTag = 'li',
        className,
        children,
        items = [],
        ...rest,
    }) => {

    const classes = classname({
        'fl-asst-list' : true,
    }, className )

    // Wrap children
    const newChildren = Children.map( children, child => {
        return createElement( childTag, {}, child)
    })

    const props = {
        ...rest,
        className: classes,
        children: newChildren,
    }
    return (
        <Tag {...props} />
    )
}
