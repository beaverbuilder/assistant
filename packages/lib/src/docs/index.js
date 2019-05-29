import React from 'react'

export const DesignSystemDocs = () => {
    const style = {
        position: 'fixed',
        top:0,
        left:0,
        bottom:0,
        right:0,
        background: 'white',
        zIndex:999999,
    }
    return (
        <div style={style}>
            <div style={{ maxWidth: '80ch', padding: '30px' }}>

                <h1>Design Lang</h1>
                <p>This is hopefully a way to be helpful</p>
            </div>
        </div>
    )
}
