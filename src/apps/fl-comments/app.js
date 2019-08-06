import React, { useEffect, useState, useContext } from 'fl-react'
import { getPagedContent } from 'assistant/utils/wordpress'
import { Page, List, App, Nav } from 'assistant/ui'

export const CommentsApp = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={Main} />
		<Nav.Route path={`${match.url}/comments/:id`} component={Page.Comment} />
	</Nav.Switch>
)

const Main = () => {
	return (
		<Page shouldPadSides={false}>
			<CommentsTab/>
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
		getPagedContent( 'comments', query, offset, ( data ) => {
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
