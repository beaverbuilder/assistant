import React, { useContext } from 'fl-react'
import { App, Page, List, Nav } from 'assistant/ui'

export const CommentsApp = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={Main} />
		<Nav.Route path={`${match.url}/comment/:id`} component={Page.Comment} />
	</Nav.Switch>
)

const Main = () => {
	const { handle } = useContext( App.Context )
	return (
		<Page shouldPadSides={false}>
			<List.Comments
				getItemProps={ ( item, defaultProps ) => ( {
					...defaultProps,
					to: {
						pathname: `/${handle}/comment/${item.id}`,
						state: item
					},
				} ) }
			/>
		</Page>
	)
}
