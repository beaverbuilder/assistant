import React, { useEffect, useState, useContext } from 'fl-react'

import { __ } from 'assistant'
import { getWpRest } from 'assistant/utils/wordpress'
import { getSystemConfig, useAppState, getAppActions } from 'assistant/data'
import { Button, List, Page, Nav, Icon, Window } from 'assistant/ui'

import { CancelToken, isCancel } from 'axios'

export const Content = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={Main} />
		<Nav.Route path={`${match.url}/posts/new`} component={Page.CreatePost} />
		<Nav.Route path={`${match.url}/posts/:id`} component={Page.Post} />
	</Nav.Switch>
)

const Main = ( { match } ) => {
	const { contentTypes } = getSystemConfig()
	const { query, pager } = useAppState( 'fl-content' )
	const { setQuery, setPager } = getAppActions( 'fl-content' )

	const Toolbar = () => {
		return (
			<Button.Group>
				{ Object.keys( contentTypes ).map( ( type, i ) =>
					<Button
						key={i}
						isSelected={ type === query.post_type }
						onClick={ () => {
							query.post_type = type
							setQuery( { ...query } )
						} }
					>
						{ contentTypes[ type ].labels.plural }
					</Button>
				) }
			</Button.Group>
		)
	}

	const Actions = ( { baseUrl } ) => {
		return (
			<>
				<Nav.Link to={`${baseUrl}/posts/new`}>
					<Icon.Plus />
				</Nav.Link>
			</>
		)
	}

	return (
		<Page shouldPadSides={false} toolbar={<Toolbar />} headerActions={<Actions baseUrl={match.url} />}>
			<List.Posts
				query={ query }
				onItemsLoaded={ response => {
					setPager( response.data )
				} }
			/>
		</Page>
	)
}
