import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
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
		<Widget title={__( 'Recently Edited' )} isPadded={false}>
			<div style={{ padding: '0 var(--fl-asst-base-padding)'}}>
				<TagGroup appearance="vibrant">
					<Tag onClick={ () => setPostType( 'any' )} isSelected={isTagSelected( 'any' )}>{__( 'Any Type' )}</Tag>
					<Tag onClick={ () => setPostType( 'post' )} isSelected={isTagSelected( 'post' )}>{__( 'Posts' )}</Tag>
					<Tag onClick={ () => setPostType( 'page' )} isSelected={isTagSelected( 'page' )}>{__( 'Pages' )}</Tag>
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
