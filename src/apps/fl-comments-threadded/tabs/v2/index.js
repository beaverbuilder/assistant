import React from 'react'
import { __ } from '@wordpress/i18n'
import { List, Filter } from 'assistant/ui'
import { useAppState, getAppActions } from 'assistant/data'
import { statuses } from '../../app'
import Comment from './comment'

export default ({ baseURL }) => {
	const { type } = useAppState()
	const { setType } = getAppActions()

	const Filters = () => {
		return (
			<Filter>
				<Filter.RadioGroupItem
					title={ __( 'Status' ) }
					items={ statuses }
					value={ type }
					defaultValue={ 'hold' }
					onChange={ value => setType( value ) }
				/>
			</Filter>
		)
	}

	return (
		<List.Comments
			className="fl-asst-comment-list"
			before={ <Filters /> }
			type={type}
			direction={null}
			getItemComponent={ () => Comment }
			getItemProps={ ( item, defaultProps ) => {
				const {
					id,
					content,
					approved,
					spam,
					trash,
					author,
					thumbnail,
					date,
				} = item

				return {
					...defaultProps,
					key: id,
					content,
					isPending: ! approved,
					isSpam: spam,
					isTrash: trash,
					author: {
						name: author,
						avatar: thumbnail,
						date,
					},
					to: {
						pathname: `${baseURL}/comment/${id}`,
						state: { item }
					},
				}
			}}
		/>
	)
}
