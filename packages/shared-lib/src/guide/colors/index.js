import React from 'fl-react'

const ColorSample = ({ value, name }) => {
    const style = {
        background: value,
        width: 36,
        height: 36,
        borderRadius: '50%',
    }
    return (
        <div>
            <div style={style}></div>
            <div>{ name ? name : value }</div>
        </div>
    )
}

export const ColorGuide = () => {
    return (
        <>
            <h2>Colors</h2>
            <ColorSample
                name="Red"
                value="red"
            />
            <ColorSample
                value="hsl(214, 4%, 86%)"
            />
        </>
    )
}
