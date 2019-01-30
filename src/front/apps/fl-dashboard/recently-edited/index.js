import React from 'react'
import classname from 'classnames'
import { Widget, Tag, TagGroup, ContentQuery } from 'components'
import { useAppState } from 'store'
import './style.scss'

export const RecentlyEditedWidget = () => {
	const [ postType, setPostType ] = useAppState( 'post-type', 'any' )
	const recentQuery = {
		'posts_per_page': 5,
	}
	if ( postType ) {
		recentQuery['post_type'] = postType
	}
	const isTagSelected = value => postType === value

	const classes = classname({
		'fl-asst-recently-edited-widget' : true
	})

	return (
		<Widget title="Recently Edited" isPadded={false} className={classes}>
			<div style={{ padding: '0 20px'}}>
				<TagGroup appearance="vibrant">
					<Tag onClick={ () => setPostType( 'any' )} isSelected={isTagSelected( 'any' )}>Any Type</Tag>
					<Tag onClick={ () => setPostType( 'post' )} isSelected={isTagSelected( 'post' )}>Posts</Tag>
					<Tag onClick={ () => setPostType( 'page' )} isSelected={isTagSelected( 'page' )}>Pages</Tag>
				</TagGroup>
			</div>
			<ContentQuery query={recentQuery} placeholderItemCount={5} />
		</Widget>
	)
}
