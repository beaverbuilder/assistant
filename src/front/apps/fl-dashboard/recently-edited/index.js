import React, { useState } from 'react'
import {
	Widget,
	Tag,
	TagGroup,
	PostList,
} from 'components'

export const RecentlyEditedWidget = () => {
	const [ postType, setPostType ] = useState( 'any' )
	const isTagSelected = value => postType === value

	return (
		<Widget title="Recently Edited" isPadded={false}>
			<div style={{ padding: '0 var(--fl-asst-base-padding)'}}>
				<TagGroup appearance="vibrant">
					<Tag onClick={ () => setPostType( 'any' )} isSelected={isTagSelected( 'any' )}>Any Type</Tag>
					<Tag onClick={ () => setPostType( 'post' )} isSelected={isTagSelected( 'post' )}>Posts</Tag>
					<Tag onClick={ () => setPostType( 'page' )} isSelected={isTagSelected( 'page' )}>Pages</Tag>
				</TagGroup>
			</div>
			<PostList
				query={{
					posts_per_page: 5,
					post_type: postType,
				}}
				placeholderItemCount={5}
			/>
		</Widget>
	)
}
