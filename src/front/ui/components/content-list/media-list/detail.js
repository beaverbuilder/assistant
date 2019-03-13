import React, { Fragment, useContext } from 'react'
import Color from 'color'
import { __ } from '@wordpress/i18n'
import {
	ViewContext,
	BackButton,
	CopyButton,
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
		alt,
		description,
		filesize,
		id,
		mime,
		date,
		editUrl,
		sizes,
		thumbnail,
		title,
		url: pageURL,
		removeItem,
	} = view

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
		maxHeight: '75vh',
		background,
	}

	let topLeftBg = null
	if ( topLeft.hex ) {
		let tlColor = Color( topLeft.hex )
		if ( tlColor.isDark() ) {
			topLeftBg = tlColor.darken( .2 ).hex()
		} else {
			topLeftBg = tlColor.lighten( .2 ).hex()
		}
	}

	const btnStyles = {
		background: topLeftBg,
		color: topLeft.isDark ? 'white' : 'var(--fl-title-color)',
		margin: 10,
		boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
	}

	const trashClicked = () => {
		const message = __( 'Do you really want to delete this item?' )
		const type = mime.split( '/' ).shift()
		if ( confirm( message ) ) {
			updatePost( id, 'trash' )
			decrementCount( `attachment/${ type }` )
			removeItem()
			popView()
		}
	}

	return (
		<Fragment>
			<div style={toolbarStyles}><BackButton style={btnStyles} /></div>
			<Photo src={url} style={imgStyles} />

			<Padding>
				<TagGroup appearance='muted' id="fl-asst-media-actions">
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
				{ title && <SettingsItem label='Title'>{title}</SettingsItem> }
				{ alt && <SettingsItem label='Alt Text'>{alt}</SettingsItem> }
				{ description && <SettingsItem label='Description'>{description}</SettingsItem> }
				<SettingsItem labelPosition='above'>
					<CopyButton label='Copy URL' text={ pageURL } />
				</SettingsItem>
			</SettingsGroup>
		</Fragment>
	)
}
