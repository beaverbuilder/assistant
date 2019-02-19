import React, { useContext } from 'react'
import {
	ContentListDetail,
	ScreenHeader,
	TagGroup,
	Tag,
	Widget,
	ViewContext,
} from 'components'

export const UserDetail = () => {
	const {
		content,
		editUrl,
		url,
		title,
	} = useContext( ViewContext )

	return (
		<ContentListDetail className='fl-asst-user-detail'>
			<ScreenHeader title={ title }>
				<TagGroup appearance='muted'>
					<Tag href={url}>View</Tag>
					<Tag href={editUrl}>Edit</Tag>
				</TagGroup>
			</ScreenHeader>
			<Widget title='Bio'>
				<div dangerouslySetInnerHTML={ { __html: content } } />
			</Widget>
		</ContentListDetail>
	)
}
