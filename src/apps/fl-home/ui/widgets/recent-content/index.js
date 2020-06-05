import React, { memo } from 'react'
import { __ } from '@wordpress/i18n'
import { List, Button } from 'assistant/ui'
import { useSystemState } from 'assistant/data'
import { Card } from 'home/ui'
import './style.scss'

const handle = 'fl-content'

const RecentContentWidget = memo( ( {
	type = 'post',
	title = __( 'Recent Posts' ),
	...rest
} ) => {
	const { counts } = useSystemState( 'counts' )
	const typeCount = counts[`content/${type}`]

	const Actions = () => {
		return (
			<Button
				appearance="transparent"
				status="primary"
				to={`/fl-content/tab/${type}`}
			>{__('View All')}</Button>
		)
	}

	return (
		<Card
			eyebrow={ __( 'Content' ) }
			title={ title }
			className="fl-asst-recent-content-card"
			contentProps={ {
				style: {
					minHeight: 5 > typeCount ? 46 * typeCount : null
				}
			} }
			{ ...rest }
			actions={ <Actions /> }
		>
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
