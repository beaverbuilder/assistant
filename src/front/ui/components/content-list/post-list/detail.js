import React, { useContext } from 'react'
import Clipboard from 'react-clipboard.js'
import {
	ContentListDetail,
	Padding,
	ScreenHeader,
	TagGroup,
	Tag,
	ViewContext,
} from 'components'

export const PostListDetail = () => {
	const { meta, title, url, editUrl } = useContext( ViewContext )
	return (
		<ContentListDetail>
			<ScreenHeader title={title}>
				<TagGroup>
					<Tag href={url}>View</Tag>
					<Tag href={editUrl}>Edit</Tag>
				</TagGroup>
			</ScreenHeader>
			<Padding>
				<div>By { meta }</div>
				<Clipboard data-clipboard-text={url} button-className="fl-asst-button">Copy URL</Clipboard>
			</Padding>
		</ContentListDetail>
	)
}
