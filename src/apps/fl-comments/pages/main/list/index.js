import React from 'react'
import { __ } from '@wordpress/i18n'
import { AnimatePresence } from 'framer-motion'
import { List } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import Comment from './comment'


export default ( { baseURL } ) => {
	const { type } = useAppState()

	return (
		<AnimatePresence>
			<List.Comments
				className="fl-asst-comment-list"
				type={ type }
				direction={ null }
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
					} = item

					return {
						...defaultProps,
						key: id,
						content,
						isPending: ! approved,
						isSpam: spam,
						isTrash: trash,
						author: {
							name: authorName,
							avatar: thumbnail,
							date: timeDiff,
							email: authorEmail,
							ip: authorIP,
							url: authorURL,
						},
						to: {
							pathname: `${baseURL}/comment/${id}`,
							state: { item }
						},
					}
				} }
			/>
		</AnimatePresence>
	)
}
