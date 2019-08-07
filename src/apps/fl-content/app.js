import React, { useEffect, useState, useContext } from 'fl-react'

import { __ } from 'assistant'
import { getWpRest } from 'assistant/utils/wordpress'
import { getSystemConfig, useAppState, getAppActions } from 'assistant/data'
import { Button, List, Page, Nav, Icon, Window } from 'assistant/ui'

import { CancelToken, isCancel } from 'axios'

export const Content = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={Main} />
		<Nav.Route path={`${match.url}/post/new`} component={Page.CreatePost} />
		<Nav.Route path={`${match.url}/post/:id`} component={Page.Post} />
	</Nav.Switch>
)

const Main = ( { match } ) => {

	const { contentTypes } = getSystemConfig()
	const { query, pager } = useAppState( 'fl-content' )
	const { setQuery, setPager } = getAppActions( 'fl-content' )
	const { size } = useContext( Window.Context )

	const wp = getWpRest()
	const source = CancelToken.source()

	useEffect( () => {
		setPager({
			items: [],
			items_count: 0,
			current_offset: 0,
			current_page: 0,
			first_page: 1,
			has_more: true,
			last_page: 2,
			items_per_page: 20,
			total_pages: 1
		})


		let config = {
			cancelToken: source.token,
			cache: {
				debug: true
			}
		}

		wp.getPagedContent( 'posts', query, 0, config )
			.then( ( response ) => {
				setPager( response.data )
			} )
			.catch( error => {
				if ( isCancel( error ) ) {
					console.log( 'request cancelled', error.message )
				} else {
					console.log( 'some other error', error )
				}
			} )

		return () => {
		    source.cancel( 'unmounting component' )
		}
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
				items={ pager.items }
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
