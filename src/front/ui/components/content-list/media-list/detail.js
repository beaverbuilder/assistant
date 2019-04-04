import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import {
	ViewContext,
	CopyButton,
	Photo,
	Separator,
	Tag,
	TagGroup,
	Title,
	Padding,
	SettingsGroup,
	SettingsItem,
	StackContext,
	useImageData,
} from 'components'
import { updatePost } from 'utils/wordpress'
import { getSystemActions } from 'store'

export const MediaDetail = () => {
	const { dismiss } = useContext( StackContext )
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

	let background = whole.hex

	const imgStyles = {
		maxHeight: '70vh',
		background,
	}

	const titleStyles = {
		backgroundColor: topLeft.isDark ? 'var(--fl-asst-light-color)' : 'var(--fl-asst-dark-color)',
		color: topLeft.isDark ? 'var(--fl-asst-dark-color)' : 'var(--fl-asst-light-color)',
	}

	const trashClicked = () => {
		const message = __( 'Do you really want to delete this item?' )
		const type = mime.split( '/' ).shift()
		if ( confirm( message ) ) {
			updatePost( id, 'trash' )
			decrementCount( `attachment/${ type }` )
			removeItem()
			dismiss()
		}
	}

	return (
		<Fragment>
			<Title shouldOverlay={true} style={titleStyles}>{__( 'Edit Media' )}</Title>
			<Photo src={url} style={imgStyles} />

			<Padding>
				<TagGroup appearance='muted' id="fl-asst-media-actions">
					<Tag href={pageURL}>{__( 'View' )}</Tag>
					<Tag href={editUrl}>{__( 'Edit' )}</Tag>
					<Tag onClick={trashClicked} appearance='warning'>{__( 'Delete' )}</Tag>
				</TagGroup>
			</Padding>

			<SettingsGroup>
				<SettingsItem label={__( 'Filesize' )}>
					{filesize}
				</SettingsItem>
				<SettingsItem label={__( 'Uploaded Date' )}>
					{date}
				</SettingsItem>
			</SettingsGroup>

			<Separator />
			<SettingsGroup>
				{ title && <SettingsItem label={__( 'Title' )}>{title}</SettingsItem> }
				{ alt && <SettingsItem label={__( 'Alternate Text' )}>{alt}</SettingsItem> }
				{ description && <SettingsItem label={__( 'Description' )}>{description}</SettingsItem> }
				<SettingsItem labelPosition='above'>
					<CopyButton label={__( 'Copy URL' )} text={ pageURL } />
				</SettingsItem>
			</SettingsGroup>
		</Fragment>
	)
}
