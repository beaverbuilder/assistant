import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import {
	ViewContext,
	CopyButton,
	Photo,
	Tag,
	TagGroup,
	Title,
	Form,
	Icon,
	StackContext,
	useImageData,
} from 'components'
import { updatePost } from 'shared-utils/wordpress'
import { getSystemActions } from 'data'

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
	} else if ( 'undefined' !== typeof sizes.large ) {
		url = sizes.large.url
	} else if ( 'undefined' !== typeof sizes.medium ) {
		url = sizes.medium.url
	}

	const imgData = useImageData( url )
	const { colors } = imgData
	const { whole } = colors

	let background = whole.hex

	const imgStyles = {
		maxHeight: '70vh',
		background,
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
			<Title shouldOverlay={ true } shouldInvertColors={ true }>{__( 'Edit Media' )}</Title>

			<div className="fl-asst-media-detail-header">
				{ url && <Photo src={ url } style={ imgStyles } /> }
				{ ! url && <Icon name="document" /> }
			</div>

			<form>
				<Form.Item>
					<TagGroup appearance='muted' id="fl-asst-media-actions">
						<Tag href={ pageURL }>{__( 'View' )}</Tag>
						<Tag href={ editUrl }>{__( 'Edit' )}</Tag>
						<Tag onClick={ trashClicked } appearance='warning'>{__( 'Delete' )}</Tag>
					</TagGroup>
				</Form.Item>

				<Form.Section label={ __( 'Attachment Details' ) } isInset={ true }>
					{ title && <Form.Item label={ __( 'Title' ) } placement="beside">{title}</Form.Item> }
					{ alt && <Form.Item label={ __( 'Alternate Text' ) } placement="beside">{alt}</Form.Item> }
					{ description && <Form.Item label={ __( 'Description' ) }>{description}</Form.Item> }
				</Form.Section>

				<Form.Section label={ __( 'File Metadata' ) } isInset={ true }>
					<Form.Item label={ __( 'Filesize' ) } placement="beside">
						{filesize}
					</Form.Item>
					<Form.Item label={ __( 'Uploaded Date' ) } placement="beside">
						{date}
					</Form.Item>
					<Form.Item label={ __( 'File Type' ) } placement="beside">
						{mime}
					</Form.Item>
				</Form.Section>

				<Form.Footer>
					<CopyButton label={ __( 'Copy URL' ) } text={ pageURL } />
				</Form.Footer>
			</form>
		</Fragment>
	)
}
