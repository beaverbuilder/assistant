import React, { useContext } from 'react'
import {
	Widget,
	Tag,
	TagGroup,
	ContentQuery,
	UIContext,
} from 'components'
import { useAppState } from 'store'
import { recentQuery } from './queries'

export const RecentlyEditedWidget = () => {
	const [ postType, setPostType ] = useAppState( 'post-type', 'any' )
	const isTagSelected = value => postType === value
	const { goToURL } = useContext( UIContext )

	const itemProps = {
		onAccessoryClick: ( { data }, e ) => {
			const { url } = data
			goToURL( url )
			e.stopPropagation()
		}
	}

	return (
		<Widget title="Recently Edited" isPadded={false}>
			<div style={{ padding: '0 20px'}}>
				<TagGroup appearance="vibrant">
					<Tag onClick={ () => setPostType( 'any' )} isSelected={isTagSelected( 'any' )}>Any Type</Tag>
					<Tag onClick={ () => setPostType( 'post' )} isSelected={isTagSelected( 'post' )}>Posts</Tag>
					<Tag onClick={ () => setPostType( 'page' )} isSelected={isTagSelected( 'page' )}>Pages</Tag>
				</TagGroup>
			</div>
			<ContentQuery
				query={recentQuery( postType )}
				placeholderItemCount={5}
				itemProps={itemProps}
			/>
		</Widget>
	)
}
