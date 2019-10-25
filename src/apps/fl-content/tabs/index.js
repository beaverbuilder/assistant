import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { List, App, Page } from 'assistant/ui'
import { useAppState } from 'assistant/data'

export const SummaryTab = () => {
	const { handle } = useContext( App.Context )
	return (
		<>
			<Page.Section>
				Stats.
			</Page.Section>

			<Page.Section label={ __( 'Latest Posts' ) } shouldPadSides={ false }>
				<List.Posts
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
			</Page.Section>
		</>
	)
}

export const PostTypeTab = ( { type = 'post' } ) => {
	const { handle } = useContext( App.Context )
	const { query } = useAppState( 'fl-content' )
	return (
		<>
			<List.Posts
				query={ { ...query, post_type: type } }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						return {
							...defaultProps,
							to: {
								pathname: `/${handle}/post/${item.id}`,
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
