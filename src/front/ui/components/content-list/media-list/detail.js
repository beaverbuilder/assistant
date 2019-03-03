import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
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
	useImageData,
} from 'components'
import { updatePost } from 'utils/wordpress'
import { getSystemActions } from 'store'

export const MediaDetail = () => {
	const { popView } = useContext( StackContext )
	const { decrementCount } = getSystemActions()
	const view = useContext( ViewContext )
	const {
		attachment,
		id,
		type,
		date,
		editUrl,
		url: pageURL,
		removeItem,
	} = view

	const {
		title,
		alt,
		description,
		filesize,
		sizes,
		thumbnail,
	} = attachment

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
		const message = __( 'Do you really want to delete this item?' )
		if ( confirm( message ) ) {
			updatePost( id, 'trash' )
			decrementCount( `content/${ type }` )
			removeItem()
			popView()
		}
	}

	return (
		<Fragment>
			<div style={toolbarStyles}><BackButton style={btnStyles} /></div>
			<Photo src={url} style={imgStyles} />

			<Padding>
				<TagGroup appearance='muted'>
					<Tag href={pageURL}>View</Tag>
					<Tag href={editUrl}>Edit</Tag>
					<Tag onClick={trashClicked} appearance='warning'>Delete</Tag>
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
