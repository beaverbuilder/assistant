import React from 'react'
import { __ } from '@wordpress/i18n'
import { AnimatePresence } from 'framer-motion'
import { List, Filter } from 'assistant/ui'
import { useAppState, getAppActions } from 'assistant/data'
import { statuses, defaultStatus } from '../../../data'
import Comment from './comment'

export default ( { baseURL } ) => {
	const { type } = useAppState()
	const { setType } = getAppActions()

	const Filters = () => {
		return (
			<Filter>
				<Filter.RadioGroupItem
					title={ __( 'Status' ) }
					items={ statuses }
					value={ type }
					defaultValue={ defaultStatus }
					onChange={ value => setType( value ) }
				/>
				<Filter.Button onClick={ () => setType( defaultStatus ) }>{__( 'Reset Filter' )}</Filter.Button>
			</Filter>
		)
	}

	return (
		<AnimatePresence>
			<List.Comments
				className="fl-asst-comment-list"
				before={ <Filters /> }
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
