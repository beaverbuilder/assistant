import React from 'react'
import Img from 'react-image'
import classname from 'classnames'
import './style.scss'

const getAverageColor = img => {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var width = canvas.width = img.naturalWidth
    var height = canvas.height = img.naturalHeight

    ctx.drawImage(img, 0, 0)

    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;
    var r = 0
    var g = 0
    var b = 0

    for (var i = 0, l = data.length; i < l; i += 4) {
        r += data[i]
        g += data[i+1]
        b += data[i+2]
    }

    r = Math.floor(r / (data.length / 4))
    g = Math.floor(g / (data.length / 4))
    b = Math.floor(b / (data.length / 4))

    return { r, g, b, }
}

export const useImage = url => {

    const img = new Image()
    img.src = url
    const color = getAverageColor( img )

    return {
        img,
        url,
        height: img.naturalHeight,
        width: img.naturalWidth,
        color,
    }
}

export const Photo = props => {
    const { className } = props
    const classes = classname({
        'fl-asst-image' : true,
    }, className )

    const merged = Object.assign({}, props, {
        className: classes,
    })
    return (
        <Img {...merged} />
    )
}
