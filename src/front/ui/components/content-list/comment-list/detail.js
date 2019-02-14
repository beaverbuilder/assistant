import React from 'react'
import { ContentListDetail, Padding, ScreenHeader } from 'components'

export const CommentListDetail = ( { data } ) => {
	const { meta, title } = data
	return (
		<ContentListDetail>
			<ScreenHeader title={title} />
			<Padding>
				<div>By { meta }</div>
			</Padding>
		</ContentListDetail>
	)
}
