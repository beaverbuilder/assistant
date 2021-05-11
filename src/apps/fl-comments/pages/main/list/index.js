import React from 'react'
import { __ } from '@wordpress/i18n'
import { AnimatePresence } from 'framer-motion'
import { List, Icon, Env } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import { applyFilters } from '@wordpress/hooks'
import Comment from './comment'

export default ( { baseURL } ) => {
	const { type } = useAppState( 'fl-comments' )
	const env = Env.use()

	return (
		<AnimatePresence>
			<List.Comments
				className="fl-asst-comment-list"
				type={ type }
				direction={ null } // removes unused class
				getItemComponent={ () => Comment }
				getItemProps={ ( item, defaultProps ) => {
					const {
						id,
						content,
						approved,
						spam,
						trash,
						thumbnail,
						authorName,
						authorEmail,
						authorIP,
						authorURL,
						timeDiff,
						post,
					} = item

					const to = {
						pathname: `${baseURL}/comment/${id}`,
						state: { item }
					}

					const actions = applyFilters( 'fl-asst.list-item-actions', [
						{
							handle: 'view-comment',
							href: item.url,
							title: __( 'View Comment' ),
							icon: <Icon.View />
						},
						{
							handle: 'edit-comment',
							to,
							title: __( 'Edit Comment' ),
							icon: <Icon.Edit />
						}
					], { item, listType: 'comment', env } )

					return {
						...defaultProps,
						...item,
						key: id,
						content,
						isPending: ! approved,
						isSpam: spam,
						isTrash: trash,
						post,
						author: {
							name: authorName,
							avatar: thumbnail,
							date: timeDiff,
							email: authorEmail,
							ip: authorIP,
							url: authorURL,
						},
						to,
						actions,
					}
				} }
			/>
		</AnimatePresence>
	)
}
