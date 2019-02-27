import React, { useEffect, useState } from 'react'
import Color from 'color'
import Img from 'react-image'
import classname from 'classnames'
import './style.scss'

export const useImageData = url => {
	const defaults = {
		element: null,
		isLoaded: false,
		didFail: false,
		url,
		height: null,
		width: null,
		colors: getColorDataForImage()
	}
	const [ data, setData ] = useState( defaults )

	// When the component mounts, load the image
	useEffect( () => {
		const img = new Image()
		img.src = url
		img.onload = () => {
			const colors = getColorDataForImage( img )
			setData( {
				...defaults,
				element: img,
				isLoaded: true,
				height: img.naturalHeight,
				width: img.naturalWidth,
				colors,
			} )
		}
		img.onerror = () => {
			setData( {
				...defaults,
				didFail: true,
			} )
		}
	}, [] )

	return data
}

const getColorDataForImage = img => {
	const canvas = document.createElement( 'canvas' )
	const ctx = canvas.getContext( '2d' )

	if ( 'undefined' === typeof img ) {
		img = new Image()
	}

	const width = canvas.width = img.naturalWidth
	const height = canvas.height = img.naturalHeight
	ctx.drawImage( img, 0, 0 )

	const colors = {}
	const areas = {
		'whole': [ 0, 0, width, height ],
		'topLeft': [ 0, 0, width * .2, width * .2 ],
		'topRight': [ width * .8, 0, width * .2, width * .2 ],
		'bottomLeft': [ 0, width * .8, width * .2, width * .2 ],
		'bottomRight': [ width * .8, width * .8, width * .2, width * .2 ],

		'top': [ 0, 0, width, width * .2 ],
		'bottom': [0, width * .8, width, width * .2 ],
		'center': [ width * .4, width * .4, width * .2, width * .2 ],
	}

	const getColors = data => {
		const defaults = {
			r: null,
			g: null,
			b: null,
			hex: null,
			isDark: null,
			isLight: null,
			brightness: null,
		}

		if ( ! data ) {
			return defaults
		}

		const color = Color( getAvgColor( data ) )

		const props = {
			...defaults,
			...color.object(),
			hex: color.hex(),
			hsl: color.hsl().string(),
			isDark: color.isDark(),
			isLight: color.isLight(),
			brightness: color.luminosity(),
		}
		return props
	}

	Object.keys( areas ).map( key => {
		const [ x, y, width, height ] = areas[key]
		let data = null
		if ( 0 !== width && 0 !== height ) {
			const imgData = ctx.getImageData( x, y, width, height )
			data = imgData.data
		}
		colors[key] = getColors( data )
	} )

	return colors
}

// Get the average color value from the pixel data provided by a 2d canvas ( getImageDate() )
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

	return [ r, g, b ]
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
