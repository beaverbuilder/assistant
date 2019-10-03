import React, { useContext } from 'fl-react'
import { getSystemConfig, useAppState, getAppActions } from 'assistant/data'
import { App, Button, List, Page, Nav, Icon } from 'assistant/ui'

export const Content = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}/` } component={ Main } />
		<Nav.Route path={ `${match.url}/post/new` } component={ Page.CreatePost } />
		<Nav.Route path={ `${match.url}/post/:id` } component={ Page.Post } />
	</Nav.Switch>
)

const Main = ( { match } ) => {
	const { handle } = useContext( App.Context )
	const { contentTypes } = getSystemConfig()
	const { query } = useAppState( 'fl-content' )
	const { setQuery } = getAppActions( 'fl-content' )

	const Toolbar = () => {
		return (
			<Button.Group>
				{ Object.keys( contentTypes ).map( ( type, i ) =>
					<Button
						key={ i }
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
		const to = {
			pathname: `${baseUrl}/post/new`,
			state: {
				detailBaseUrl: `${baseUrl}/post`
			}
		}
		return (
			<>
				<Nav.ButtonLink to={ to } appearance="transparent">
					<Icon.Plus />
				</Nav.ButtonLink>
			</>
		)
	}

	return (
		<Page shouldPadSides={ false } toolbar={ <Toolbar /> } headerActions={ <Actions baseUrl={ match.url } /> }>
			<List.Posts
				query={ query }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						return {
							...defaultProps,
							to: {
								pathname: `/${handle}/post/${item.id}`,
								state: { item }
							},
						}
					}
					return defaultProps
				} }
			/>
		</Page>
	)
}
