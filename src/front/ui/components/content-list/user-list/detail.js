import React, { useContext } from 'react'
import {
	ContentItem,
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
		email,
		url,
		title,
		thumbnail,
	} = useContext( ViewContext )

	const headerTitle = (
		<ContentItem
			thumbnail={ thumbnail }
			title={ <strong>{ title }</strong> }
			meta={ email }
		/>
	)

	return (
		<ContentListDetail className='fl-asst-user-detail'>
			<ScreenHeader title={ headerTitle }>
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
