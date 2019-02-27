import React, { Fragment, useContext } from 'react'
import {
	ViewContext,
	BackButton,
	Photo,
	Separator,
	Tag,
	TagGroup,
	Padding,
	StackContext,
	useImageData,
} from 'components'
import { updatePost } from 'utils/wordpress'
import { getSystemActions } from 'store'

export const MediaDetail = () => {
	const { popView } = useContext( StackContext )
	const { decrementCount } = getSystemActions()
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

	let url = thumbnail
	if ( 'undefined' !== typeof sizes.medium_large ) {
		url = sizes.medium_large.url
	} else if ( 'undefined' !== typeof sizes.medium ) {
		url = sizes.medium.url
	} else if ( 'undefined' !== typeof sizes.large ) {
		url = sizes.large.url
	}

	const imgData = useImageData( url )
	const { colors } = imgData
	const { whole, topLeft } = colors

	const toolbarStyles = {
		position: 'absolute',
		zIndex: 1,
		height: 44,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
	}

	let background = whole.hex

	const imgStyles = {
		maxHeight: '50vh',
		background,
	}

	const btnStyles = {
		background: topLeft.hex,
		color: topLeft.isDark ? 'white' : '',
		margin: 10,
		boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
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
