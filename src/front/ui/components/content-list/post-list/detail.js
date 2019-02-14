import React from 'react'
import Clipboard from 'react-clipboard.js'
import {
	ContentListDetail,
	Padding,
	ScreenHeader,
	TagGroup,
	Tag
} from 'components'

export const PostListDetail = ( { data } ) => {
	const { meta, title, url, edit_url } = data
	return (
		<ContentListDetail>
			<ScreenHeader title={title}>
				<TagGroup>
					<Tag href={url}>View</Tag>
					<Tag href={edit_url}>Edit</Tag>
				</TagGroup>
			</ScreenHeader>
			<Padding>
				<div>By { meta }</div>
				<Clipboard data-clipboard-text={url} button-className="fl-asst-button">Copy URL</Clipboard>
			</Padding>
		</ContentListDetail>
	)
}
