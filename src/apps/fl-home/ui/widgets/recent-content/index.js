import React, { memo } from 'react'
import { __ } from '@wordpress/i18n'
import { List } from 'assistant/ui'
import { Card } from 'home/ui'
import './style.scss'

const handle = 'fl-content'

const RecentContentWidget = memo( ({
	type = 'post',
	title = __( 'Recent Posts' )
}) => {

	return (
		<Card
			eyebrow={ __( 'Content' ) }
			title={ title }
			className="fl-asst-recent-content-card"
		>
			<List.Posts
				query={ {
					post_type: type,
					posts_per_page: 5
				} }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						delete defaultProps.extras
						delete defaultProps.marks

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
		</Card>
	)
} )

export default RecentContentWidget
