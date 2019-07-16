import React, { useEffect, useState, useContext } from 'fl-react'
import { Switch, Route } from 'fl-react-router-dom'
import { __ } from 'assistant'
import { useAppState, getAppActions } from 'assistant/data'
import { getPagedContent } from 'assistant/utils/wordpress'
import { Page, List, Button, App } from 'assistant/ui'

export const Alerts = ( { match } ) => (
	<Switch>
		<Route exact path={`${match.url}/`} component={Main} />
		<Route path={'/fl-alerts/comments/:id'} component={Page.Comment} />
		<Route path={'/fl-alerts/update'} component={Page.Update} />
	</Switch>
)

const Main = () => {

	const [ tab, setTab ] = useState( 'comments' )
	const isSelected = key => key === tab

	return (
		<Page shouldPadSides={false}>

			<div style={{ padding: '0 var(--fl-asst-outer-space)', display: 'flex', flexDirection: 'column' }}>

				<Button.Group>
					<Button isSelected={isSelected( 'comments' )} onClick={ () => setTab( 'comments' ) }>{__( 'Comments' )}</Button>
					<Button isSelected={isSelected( 'updates' )} onClick={ () => setTab( 'updates' ) }>{__( 'Updates' )}</Button>
				</Button.Group>
			</div>

			{ 'comments' === tab ? <CommentsTab/> : <UpdatesTab /> }

		</Page>
	)
}

const CommentsTab = () => {
	const [ comments, setComments ] = useState( [] )
	const { handle } = useContext( App.Context )
	const offset = comments.length
	const hasComments = 0 < comments.length
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
			{ ! hasComments && <div>{__( 'You don\'t have any!' )}</div> }
			{ hasComments &&
			<List
				items={comments}
				getItemProps={ ( item, defaultProps ) => {
					console.log(item)
					return {
						...defaultProps,
						key: item.id,
						label: <em><strong>{item.authorEmail}</strong> commented:</em>,
						description: item.postTitle,
						thumbnail: item.thumbnail,
						to: {
							pathname: `/${handle}/comments/${item.id}`,
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
	const { handle } = useContext( App.Context )
	const offset = updates.length
	const hasUpdates = 0 < updates.length
	const query = {
		updateType: 'all',
	}

	useEffect( () => {
		getPagedContent( 'updates', query, offset, ( data, hasMore ) => {
			setUpdates( updates.concat( data ) )
		} )
	}, [] )

	return (
		<>
			{ ! hasUpdates && <div>{__( 'You don\'t have any!' )}</div> }
			{ hasUpdates &&
			<List
				items={updates}
				isListSection={ item => 'undefined' !== typeof item.items }
				getItemProps={ ( item, defaultProps, isSection ) => {

					if ( isSection ) {
						return {
							...defaultProps,
							label: item.label
						}
					}

					return {
						...defaultProps,
						label: item.title,
						description: item.meta,
						thumbnail: item.thumbnail,
						to: {
							pathname: `/${handle}/update`,
							state: item
						}
					}
				}}
			/> }
		</>
	)
}

Alerts.Icon = () => {}
