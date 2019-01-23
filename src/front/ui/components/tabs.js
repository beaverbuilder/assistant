import React, { Fragment } from 'react'
import classname from 'classnames'

export const TabManager = ({ activeTabName, children }) => {
    return React.Children.map(children, child => {
        const isSelected = child.props.name === activeTabName ? true : false
        return React.cloneElement(child, { isSelected: isSelected })
    })
}

export const Tab = ({ name, children, isSelected }) => {
    return (
        <div className="fl-asst-tab" hidden={!isSelected}>
            {children}
        </div>
    )
}
