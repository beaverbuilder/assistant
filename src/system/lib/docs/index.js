import React, { Fragment } from 'fl-react'
import { Docs } from './pages'

export const DesignSystemDocs = ({ windowMargin = 0, align = 'left' }) => {

    let style = {
        position: 'fixed',
        top:0,
        left:0,
        bottom:0,
        right:0,
        zIndex: -1,
        overflow: 'auto',
    }
    if ( 'left' === align ) {
        style.paddingRight = windowMargin
    } else {
        style.paddingLeft = windowMargin
    }

    const contentStyle = {
        maxWidth: '120ch',
        padding: 60,
        margin: 'auto',
    }

    return (
        <div style={style} className="fl-asst-surface">
            <div style={contentStyle}>
                <h1>Design Docs</h1>
                <Docs />
            </div>
        </div>
    )
}
