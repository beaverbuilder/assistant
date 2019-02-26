import React from 'react'
import Img from 'react-image'
import classname from 'classnames'
import './style.scss'

export const getColorData = img => {
	const canvas = document.createElement( 'canvas' )
	const ctx = canvas.getContext( '2d' )
	const width = canvas.width = img.naturalWidth
	const height = canvas.height = img.naturalHeight
	ctx.drawImage( img, 0, 0 )

	// Whole image
	const { data } = ctx.getImageData( 0, 0, width, height )
	const avg = getAvgColor( data )
	const brightness = getBrightness( avg.r, avg.g, avg.b )

	// Top left 60x60px
	const topLeftData = ctx.getImageData( 0, 0, 60, 60 )
	const tlAvg = getAvgColor( topLeftData.data )
	const tlBrightness = getBrightness( tlAvg.r, tlAvg.g, tlAvg.b )

	return {
		r: avg.r,
		g: avg.g,
		b: avg.b,
		rgb: avg.rgb,
		brightness,
		isDark: isDark( brightness ),
		topLeft: {
			color: tlAvg,
			isDark: isDark( tlBrightness )
		}
	}
}

const getAvgColor = data => {
	let r = 0,
		g = 0,
		b = 0

	for ( let i = 0, l = data.length; i < l; i += 4 ) {
		r += data[i]
		g += data[i + 1]
		b += data[i + 2]
	}

	r = Math.floor( r / ( data.length / 4 ) )
	g = Math.floor( g / ( data.length / 4 ) )
	b = Math.floor( b / ( data.length / 4 ) )

	return {
		r,
		g,
		b,
		rgb: `rgb(${r},${g},${b})`
	}
}

const getBrightness = ( r, g, b ) => {
	return Math.sqrt(
		0.299 * ( r * r ) +
		0.587 * ( g * g ) +
		0.114 * ( b * b )
	)
}

const isDark = brightness => {
	return 127.5 > brightness
}

export const useImage = url => {

	const img = new Image()
	img.src = url
	const color = getColorData( img )

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
	const classes = classname( {
		'fl-asst-image': true,
	}, className )

	const merged = Object.assign( {}, props, {
		className: classes,
	} )
	return (
		<Img {...merged} />
	)
}
