import React, { useState, useContext } from 'fl-react'
import { __ } from 'assistant/i18n'
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
	const { setQuery, setPager } = getAppActions( 'fl-content' )
	const [ isSelecting, setIsSelecting ] = useState( false )

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
		return (
			<>
				<Button onClick={ () => setIsSelecting( ! isSelecting ) }>{ isSelecting ? __( 'Cancel' ) : __( 'Select' ) }</Button>
				<Nav.Link to={ `${baseUrl}/post/new` }>
					<Icon.Plus />
				</Nav.Link>
			</>
		)
	}

	return (
		<Page shouldPadSides={ false } toolbar={ <Toolbar /> } headerActions={ <Actions baseUrl={ match.url } /> }>
			<List.Posts
				query={ query }
				onItemsLoaded={ response => {
					setPager( response.data )
				} }
				getItemProps={ ( item, defaultProps ) => ( {
					...defaultProps,
					to: {
						pathname: `/${handle}/post/${item.id}`,
						state: { item }
					},
				} ) }

				isSelecting={ isSelecting }
			/>
		</Page>
	)
}
