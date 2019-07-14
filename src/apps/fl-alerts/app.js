import React, { useEffect, useState } from 'fl-react'
import { Switch, Route } from 'fl-react-router-dom'
import { __ } from 'assistant'
import { getPagedContent } from 'assistant/utils/wordpress'
import { Page, List, Button } from 'assistant/ui'

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

			<div style={{ padding: '0 var(--fl-asst-outer-space)', display:'flex', flexDirection: 'column' }}>

				<Button.Group>
					<Button isSelected={isSelected('comments')} onClick={ () => setTab('comments') }>{__('Comments')}</Button>
					<Button isSelected={isSelected('updates')} onClick={ () => setTab('updates') }>{__('Updates')}</Button>
				</Button.Group>
			</div>

			{ 'comments' === tab ? <CommentsTab/> : <UpdatesTab /> }

		</Page>
	)
}

const CommentsTab = () => {
	const [ comments, setComments ] = useState( [] )
	const offset = comments.length
	const hasComments = comments.length > 0
	const baseURL = ''
	const query = {
		commentStatus: 'all',
	}

	useEffect( () => {
		getPagedContent( 'comments', query, offset, ( data, hasMore ) => {
			setComments( comments.concat( data ) )
		} )
	}, [] )

	return (
		<>
			{ !hasComments && <div>{__("You don't have any!")}</div> }
			{ hasComments &&
			<List
				items={comments}
				getItemProps={ (item, defaultProps) => {
					return {
						key: defaultProps.key,
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
	const [ updates, setUpdates ] = useState( [] )
	const offset = updates.length
	const hasUpdates = updates.length > 0
	const baseURL = ''
	const query = {
		updateType: 'all',
	}

	useEffect( () => {
		getPagedContent( 'updates', query, offset, ( data, hasMore ) => {
			setComments( updates.concat( data ) )
		} )
	}, [] )

	return (
		<>
			{ !hasUpdates && <div>{__("You don't have any!")}</div> }
			{ hasUpdates &&
			<List
				items={updates}
				getItemProps={ (item, i) => {
					return {
						key: item.key,
						label: item.meta,
						description: item.content,
						thumbnail: item.thumbnail,
						to: {
							pathname: `${baseURL}/updates/${item.key}`,
							state: item
						}
					}
				}}
			/> }
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
