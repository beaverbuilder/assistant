import React from 'react'
import { __ } from '@wordpress/i18n'
import { List } from 'assistant/ui'
import Section from '../generic'
import './style.scss'

const RecentPostsSection = () => {
	const type = 'post'
	const baseUrl = '/fl-content'

	return (
		<Section
			title={ __( 'Recent Posts' ) }
			className="recent-posts-feature-section"
			padContent={ false }
		>
			<List.Posts
				endcap={ false }
				query={ {
					post_type: type,
					posts_per_page: 5,
					post_status: 'any'
				} }
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
