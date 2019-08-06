import React, { useEffect, useState, useContext } from 'fl-react'
import { getPagedContent } from 'assistant/utils/wordpress'
import { getSystemConfig, useAppState, getAppActions } from 'assistant/data'
import { Button, List, Page, Nav, Icon, Window } from 'assistant/ui'

export const Content = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={Main} />
		<Nav.Route path={`${match.url}/post/new`} component={Page.CreatePost} />
		<Nav.Route path={`${match.url}/post/:id`} component={Page.Post} />
	</Nav.Switch>
)

const Main = ( { match } ) => {
	const [ items, setItems ] = useState( [] )
	const { contentTypes } = getSystemConfig()
	const { query } = useAppState( 'fl-content' )
	const { setQuery } = getAppActions( 'fl-content' )
	const { size } = useContext( Window.Context )

	useEffect( () => {
		setItems( [] )

		getPagedContent( 'posts', query, 0, ( data ) => {
			setItems( data )
		} )
	}, [ query ] )

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
				<Nav.Link to={`${baseUrl}/post/new`}>
					<Icon.Plus />
				</Nav.Link>
			</>
		)
	}

	return (
		<Page shouldPadSides={false} toolbar={<Toolbar />} headerActions={<Actions baseUrl={match.url} />}>

			<List
				items={ items }
				defaultItemProps={{ shouldAlwaysShowThumbnail: true }}
				getItemProps={( item, defaultProps ) => {
					const desc = 'by ' + item.author + ' | ' + item.visibility
					return {
						...defaultProps,
						label: item.title,
						description: 'normal' === size ? desc : null,
						thumbnail: item.thumbnail,
						thumbnailSize: 'normal' === size ? 'med' : 'sm',
						to: {
							pathname: `${match.url}/post/${item.id}`,
							state: { item },
						}
					}
				}}
			/>

		</Page>
	)
}
