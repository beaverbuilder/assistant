import React, { useEffect, useState, useContext } from 'fl-react'
import { __ } from 'assistant'
import { getPagedContent } from 'assistant/utils/wordpress'
import { Page, List, Button, App, Nav } from 'assistant/ui'

export const Alerts = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={Main} />
		<Nav.Route path={'/fl-alerts/comments/:id'} component={Page.Comment} />
		<Nav.Route path={'/fl-alerts/update'} component={Page.Update} />
	</Nav.Switch>
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

const LoadingMessage = () => {
	return (
		<Page.Pad>Loading...</Page.Pad>
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
			{ ! hasComments && <List.Loading /> }
			{ hasComments &&
			<List
				items={comments}
				getItemProps={ ( item, defaultProps ) => {
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
			{ ! hasUpdates && <List.Loading /> }
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
