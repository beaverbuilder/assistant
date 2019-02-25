import React, { Fragment, useContext, useState } from 'react'
import {
	ViewContext,
	BackButton,
	Photo,
	Separator,
	getAverageColor,
} from 'components'

export const MediaDetail = () => {
	const view = useContext( ViewContext )
	const {
		filesize,
		sizes,
		date,
		data,
	} = view
	const {
		title,
		alt,
		description,
	} = data
	const [color, setColor] = useState()

	const url = sizes.medium_large.url
	const img = new Image()
	img.src = url
	img.onload = () => {
		const { rgb } = getAverageColor( img )
		setColor(rgb)
	}

	const toolbarStyles = {
		position: 'absolute',
		zIndex: 1,
		height: 44,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
	}

	const imgStyles = {
		maxHeight: '50vh',
		background: color,
	}

	return (
		<Fragment>
			<div style={toolbarStyles}><BackButton /></div>
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
						{title}
					</div>
				</div>
				<div className="fl-asst-settings-item">
					<label>Alt Text</label>
					<div className="fl-asst-settings-item-control">
						{alt}
					</div>
				</div>
				<div className="fl-asst-settings-item">
					<label>Description</label>
					<div className="fl-asst-settings-item-control">
						{description}
					</div>
				</div>
			</div>
		</Fragment>
	)
}
