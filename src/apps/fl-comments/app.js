import React from 'fl-react'
import { Page, List, Nav } from 'assistant/ui'

export const CommentsApp = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={Main} />
		<Nav.Route path={`${match.url}/comments/:id`} component={Page.Comment} />
	</Nav.Switch>
)

const Main = () => {
	return (
		<Page shouldPadSides={false}>
			<List.Comments />
		</Page>
	)
}
