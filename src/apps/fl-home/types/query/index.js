import React from 'react'
import { List } from 'assistant/ui'
import './style.scss'

const Query = () => {
	const handle = 'fl-content'
	return (
		<List.Posts
			className="fl-asst-query-card-list"
			query={ {
				post_type: 'post',
				posts_per_page: 5
			} }
			paginate={ false }
			getItemProps={ ( item, defaultProps ) => {
				if ( item.id ) {
					return {
						...defaultProps,
						description: null,
						thumbnailSize: 'sm',
						to: {
							pathname: `/${handle}/post/${item.id}`,
							state: { item }
						},
					}
				}
				return defaultProps
			} }
		/>
	)
}

Query.Edit = () => null

export default Query
