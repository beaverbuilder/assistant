import React, { Fragment, useContext, useState, useEffect } from 'react'
import {
	ViewContext,
	BackButton,
	Photo,
	Separator,
	Tag,
	TagGroup,
	Padding,
	StackContext,
	getColorData,
} from 'components'
import { updatePost } from 'utils/wordpress'
import { getSystemActions } from 'store'

export const MediaDetail = () => {
	const { popView } = useContext( StackContext )
	const { incrementCount, decrementCount } = getSystemActions()
	const view = useContext( ViewContext )
	const {
		id,
		type,
		filesize,
		sizes,
		date,
		data,
		thumbnail,
		editUrl,
		url: pageURL,
		removeItem,
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
	const { topLeft } = color

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

	const trashClicked = () => {
		updatePost( id, 'trash' )
		decrementCount( `content/${ type }` )
		removeItem()
		popView()
	}

	return (
		<Fragment>
			<div style={toolbarStyles}><BackButton style={btnStyles} /></div>
			<Photo src={url} style={imgStyles} />

			<Padding>
				<TagGroup appearance='muted'>
					<Tag href={pageURL}>View</Tag>
					<Tag href={editUrl}>Edit</Tag>
					<Tag onClick={trashClicked} appearance='warning'>Trash</Tag>
				</TagGroup>
			</Padding>

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
