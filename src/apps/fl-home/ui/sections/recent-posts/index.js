import React from 'react'
import { sprintf } from '@wordpress/i18n'
import { List } from 'assistant/ui'
import { useAppState, getAppActions, getSystemConfig } from 'assistant/data'
import Section from '../generic'
import './style.scss'

const RecentPostsSection = ( { isCollapsed, ...rest } ) => {
	const { recentPostsQuery: query } = useAppState( 'fl-home' )
	const { setRecentPostsQuery: setQuery } = getAppActions( 'fl-home' )
	const { contentTypes } = getSystemConfig()
	const baseUrl = '/fl-content'
	const postType = contentTypes[ query[ 'post_type' ] ]
	let postTypeLabel = 'Posts'
	if ( undefined !== postType ) {
		postTypeLabel = postType.labels.plural
	}

	const Actions = () => (
		<select
			onChange={ e => {
				setQuery( { ...query, post_type: e.target.value } )
			} }
		>
			{ Object.entries( contentTypes ).map( ( [ value, def ] ) => {
				return (
					<option
						key={ value }
						value={ value }
						selected={ value === query.post_type }
					>
						{ def.labels.plural }
					</option>
				)
			} ) }
		</select>
	)

	return (
		<Section
			title={ sprintf( 'Recent %s', postTypeLabel ) }
			className="recent-posts-feature-section"
			padContent={ false }
			headerActions={ ! isCollapsed && <Actions /> }
			isCollapsed={ isCollapsed }
			{ ...rest }
		>
			<List.Posts
				endcap={ false }
				query={ query }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						return {
							...defaultProps,
							description: null,
							marks: [],
							to: {
								pathname: `${baseUrl}/post/${item.id}`,
								state: { item }
							},
						}
					}
					return defaultProps
				} }
			/>
		</Section>
	)
}

export default RecentPostsSection
