import React from 'react'
import { __ } from '@wordpress/i18n'
import { List, Layout, Button, Text } from 'assistant/ui'

const RecentPosts = () => {

	const baseUrl = '/fl-content'
	const type = 'post'

	return (
		<>
			<Layout.Toolbar>
				<Text.Title>{ __( 'Recent Posts' ) }</Text.Title>

				<Button
					appearance="transparent"
					status="primary"
					to={ `/fl-content/tab/${type}` }
					style={ { marginLeft: 'auto' } }
				>{__( 'View All' )}</Button>
			</Layout.Toolbar>
			<List.Posts
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
							thumbnailSize: 'sm',
							to: {
								pathname: `${baseUrl}/post/${item.id}`,
								state: { item }
							},
						}
					}
					return defaultProps
				} }
			/>
		</>
	)
}

export default RecentPosts
