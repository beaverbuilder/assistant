import React from 'react'
import { __ } from '@wordpress/i18n'
import { List } from 'assistant/ui'
import { useAppState, getAppActions } from 'assistant/data'
import Section from '../generic'
import './style.scss'

const RecentPostsSection = ( { ...rest } ) => {
	const { recentPostsQuery: query } = useAppState( 'fl-home' )
	const { setRecentPostsQuery: setQuery } = getAppActions( 'fl-home' )
	const baseUrl = '/fl-content'

	const types = {
		post: 'Post',
		page: 'Page'
	}

	const Actions = () => (
		<select
			onChange={ e => {
				setQuery( { ...query, post_type: e.target.value } )
			} }
		>
			{ Object.entries( types ).map( ( [ value, label ] ) => {
				return (
					<option
						key={ value }
						value={ value }
						selected={ value === query.post_type }
					>
						{ label }
					</option>
				)
			} ) }
		</select>
	)

	return (
		<Section
			title={ __( 'Recent Posts' ) }
			className="recent-posts-feature-section"
			padContent={ false }
			headerActions={ <Actions /> }
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
