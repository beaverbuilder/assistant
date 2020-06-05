import React, { memo } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { List } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import { Card } from 'home/ui'
import './style.scss'

const handle = 'fl-content'

const RecentContentWidget = memo( ( {
	type = 'post',
	title = __( 'Recent Posts' )
} ) => {
	const { counts } = useSystemState('counts')
	const typeCount = counts[`content/${type}`]

	return (
		<Card
			eyebrow={ __( 'Content' ) }
			title={ title }
			className="fl-asst-recent-content-card"
			contentProps={{
				style: {
					minHeight: typeCount < 5 ? 46 * typeCount : null
				}
			}}
		>
			<List.Posts
				query={ {
					post_type: type,
					posts_per_page: 5,
					post_status: 'any'
				} }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						//delete defaultProps.extras

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
