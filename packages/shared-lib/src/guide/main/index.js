import React from 'fl-react'
import { ColorGuide } from '../colors'
import { ContentGuide } from '../content'

export const Main = () => {
    const style = {
        position: 'fixed',
        top: '30vh',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        zIndex: 9,
        overflow: 'auto',
    }
    return (
        <div style={style}>
            <Guide />
        </div>
    )
}

const Guide = () => {
    const style = {
        padding: 60,
    }
    return (
        <div style={style}>
            <h1>Style Guide</h1>
            <hr/>
            <ColorGuide />
            <ContentGuide />
        </div>
    )
}
