import React, { useState } from 'fl-react'
import { Switch, Route, Link } from 'fl-react-router-dom'
import { __ } from 'assistant'
import { Page, List, Button } from 'assistant/ui'

import { comments } from './test-data'

export const Alerts = ( { match } ) => (
	<Switch>
		<Route exact path={`${match.url}/`} component={Main} />
		<Route path={`${match.url}/comments/:id`} component={CommentDetail} />
	</Switch>
)

const Main = () => {
	const [tab, setTab] = useState('comments')
	const isSelected = key => key === tab

	return (
		<Page shouldPadSides={false}>

			<Button.Group>
				<Button isSelected={isSelected('comments')} onClick={ () => setTab('comments') }>{__('Comments')}</Button>
				<Button isSelected={isSelected('updates')} onClick={ () => setTab('updates') }>{__('Updates')}</Button>
				
				<Button isSelected={isSelected('msg')} onClick={ () => setTab('msg') }>{__('Messages')}</Button>
			</Button.Group>

			{ 'comments' === tab ? <CommentsTab/> : <UpdatesTab /> }

		</Page>
	)
}

const CommentsTab = () => {
	const hasComments = comments.length > 0
	const baseURL = ''

	return (
		<>
			{ !hasComments && <div>{__("You don't have any!")}</div> }
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
							pathname: `${baseURL}/comments/${item.postID}`,
							state: item
						}
					}
				}}
			/> }
		</>
	)
}
const UpdatesTab = () => {
	return (
		<>
			<div className="fl-asst-padded">You don't have any updates</div>
		</>
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
