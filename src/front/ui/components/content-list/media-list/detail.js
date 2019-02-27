import React, { Fragment, useContext, useState, useEffect } from 'react'
import {
	ViewContext,
	BackButton,
	Photo,
	Separator,
	Tag,
	TagGroup,
	Padding,
	SettingsGroup,
	SettingsItem,
	StackContext,
	getColorData,
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

	const defaultColor = {
		r: 0, g: 0, b: 0,
		isDark: false,
		topLeft: {
			color: { r: 0, g: 0, b: 0, rgb: null },
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

			<SettingsGroup>
				<SettingsItem label='Filesize'>
					{filesize}
				</SettingsItem>
				<SettingsItem label='Uploaded'>
					{date}
				</SettingsItem>
			</SettingsGroup>

			<Separator />

			<SettingsGroup>
				<SettingsItem label='Title'>
					<input type="text" value={title} readOnly={true} />
				</SettingsItem>
				<SettingsItem label='Alt Text'>
					<input type="text" value={alt} readOnly={true} />
				</SettingsItem>
				<SettingsItem label='Description'>
					<textarea value={description} readOnly={true} />
				</SettingsItem>
			</SettingsGroup>
		</Fragment>
	)
}
