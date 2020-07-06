import React from 'react'

const Scroller = ({ tag: Tag = 'div', ...rest }) => {
    return (
        <Tag {...rest}>{children}</Tag>
    )
}

export default Scroller
