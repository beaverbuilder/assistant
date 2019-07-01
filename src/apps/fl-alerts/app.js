import React from 'fl-react'
import { Switch, Route, Link } from 'fl-react-router-dom'
import { Page, List } from 'assistant/lib'

import { comments } from './test-data'

export const Alerts = ( { match } ) => (
	<Switch>
		<Route exact path={`${match.url}/`} component={Main} />
		<Route path={`${match.url}/comments/:id`} component={CommentDetail} />
	</Switch>
)

const Main = ({ match }) => {
	const hasComments = comments.length > 0

	return (
		<Page shouldPadSides={false}>
			{ !hasComments && <div>You don't have any!</div> }
			{ hasComments &&
			<List
				items={comments}
				getItemProps={ (item, i) => {
					return {
						key: item.postID,
						label: <em><strong>{item.email}</strong> commented:</em>,
						description: item.content,
						thumbnail: item.thumbnail,
						to: {
							pathname: `${match.url}/comments/${item.postID}`,
							state: item
						}
					}
				}}
			/> }
		</Page>
	)
}

const CommentDetail = ( { location } ) => {
	const comment = {
		...location.state,
	}
	const { content } = comment
	return (
		<Page title="Edit Comment">
			<div dangerouslySetInnerHTML={{ __html: content }} />
		</Page>
	)
}

Alerts.Icon = () => {}
