import React, { useState } from 'react'
import { Widget, Tag, TagGroup, ContentQuery } from 'components'
import { useAppState } from 'store'

export const RecentlyEditedWidget = () => {
	const [ postType, setPostType ] = useAppState( 'fl-dashboard', 'post-type', 'any' )
	const recentQuery = {
		'posts_per_page': 5,
	}
	if ( postType ) {
		recentQuery['post_type'] = postType
	}
	const isTagSelected = value => postType === value
	return (
		<Widget title="Recently Edited" isPadded={false}>
			<div style={{ padding: '0 20px'}}>
				<TagGroup appearance="vibrant">
					<Tag onClick={ () => setPostType( 'any' )} isSelected={isTagSelected( 'any' )}>Any Type</Tag>
					<Tag onClick={ () => setPostType( 'post' )} isSelected={isTagSelected( 'post' )}>Posts</Tag>
					<Tag onClick={ () => setPostType( 'page' )} isSelected={isTagSelected( 'page' )}>Pages</Tag>
				</TagGroup>
			</div>
			<ContentQuery query={recentQuery} />
		</Widget>
	)
}
