import React, { Fragment, useContext, useState, useEffect } from 'react'
import {
	ViewContext,
	BackButton,
	Photo,
	Separator,
	getColorData,
} from 'components'

export const MediaDetail = () => {
	const view = useContext( ViewContext )
	const {
		filesize,
		sizes,
		date,
		data,
		thumbnail,
	} = view
	const {
		title,
		alt,
		description,
	} = data
	const defaultColor = {
		r: 0, g: 0, b: 0,
		isDark: false,
		topLeft: {
			color: { r:0, g:0, b:0, rgb: null },
			isDark: false,
		}
	}
	const [ color, setColor ] = useState( defaultColor )
	const { isDark, topLeft } = color

	let url = thumbnail
	if ( 'undefined' !== typeof sizes.medium_large ) {
		url = sizes.medium_large.url
	} else if ( 'undefined' !== typeof sizes.medium ) {
		url = sizes.medium.url
	} else if ( 'undefined' !== typeof sizes.large ) {
		url = sizes.large.url
	}

	useEffect( () => {
		const img = new Image()
		img.src = url
		img.onload = () => {
			const data = getColorData( img )
			setColor( data )
		}
	}, [] )

	const toolbarStyles = {
		position: 'absolute',
		zIndex: 1,
		height: 44,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
	}

	let background = null
	if ( 'undefined' !== typeof color ) {
		background = color.rgb
	}

	const imgStyles = {
		maxHeight: '50vh',
		background,
	}

	const btnStyles = {
		background: topLeft.color.rgb,
		color: topLeft.isDark ? 'white' : '',
		margin: 10,
	}

	return (
		<Fragment>
			<div style={toolbarStyles}><BackButton style={btnStyles} /></div>
			<Photo src={url} style={imgStyles} />
			<div>
				<div className="fl-asst-settings-item">
					<label>Filesize</label>
					<div className="fl-asst-settings-item-control">
						{filesize}
					</div>
				</div>
				<div className="fl-asst-settings-item">
					<label>Uploaded</label>
					<div className="fl-asst-settings-item-control">
						{date}
					</div>
				</div>
				<Separator />
				<div className="fl-asst-settings-item">
					<label>Title</label>
					<div className="fl-asst-settings-item-control">
						<input type="text" value={title} readOnly={true} />
					</div>
				</div>
				<div className="fl-asst-settings-item">
					<label>Alt Text</label>
					<div className="fl-asst-settings-item-control">
						<input type="text" value={alt} readOnly={true} />
					</div>
				</div>
				<div className="fl-asst-settings-item">
					<label>Description</label>
					<div className="fl-asst-settings-item-control">
						<textarea readOnly={true} value={description} />
					</div>
				</div>
			</div>
		</Fragment>
	)
}
