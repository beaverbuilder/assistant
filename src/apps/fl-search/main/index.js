import React, { useEffect, useRef, useState } from 'fl-react'
import { __ } from 'assistant/i18n'
import { addLeadingSlash } from 'assistant/utils/url'
import { getSearchResults } from 'assistant/utils/wordpress'
import { useInitialFocus } from 'assistant/utils/react'
import { useSystemState, getSystemActions, useAppState, getAppActions } from 'assistant/data'
import { Page, List, Icon, Button } from 'assistant/ui'
import './style.scss'

export const Main = ( { match } ) => {
	const { apps, searchHistory } = useSystemState()
	const { setSearchHistory } = getSystemActions()
	const { keyword } = useAppState( 'fl-search' )
	const { setKeyword } = getAppActions( 'fl-search' )
	const [ loading, setLoading ] = useState( false )
	const [ results, setResults ] = useState( null )
	const timeout = useRef( null )
	const request = useRef( null )

	useEffect( () => {
		const { config, routes } = getRequestConfig()

		cancelRequest()

		if ( '' === keyword ) {
			setResults( null )
			return
		}

		timeout.current = setTimeout( () => {
			setLoading( true )

			request.current = getSearchResults( keyword, routes, response => {
				const newResults = {}

				response.map( ( result, key ) => {
					const { label, priority, format } = config[ key ]

					if ( ! result.length ) {
						return
					}
					if ( ! newResults[ priority ] ) {
						newResults[ priority ] = []
					}

					newResults[ priority ].push( {
						label,
						items: format( result ),
					} )
				} )

				setResults( newResults )
				setLoading( false )
				setSearchHistory( keyword )
			} )
		}, 1000 )

		return cancelRequest
	}, [ keyword ] )

	const getRequestConfig = () => {
		const config = []
		const routes = []

		const defaults = {
			priority: 1000,
			format: response => response,
		}

		const addRequestConfig = search => {
			config.push( Object.assign( {}, defaults, search ) )
			routes.push( addLeadingSlash( search.route( keyword ) ) )
		}

		Object.entries( apps ).map( ( [ key, app ] ) => {
			if ( ! app.search || ! app.search.route ) {
				return
			} else if ( Array.isArray( app.search ) ) {
				app.search.map( search => addRequestConfig( search ) )
			} else {
				addRequestConfig( app.search )
			}
		} )

		return { config, routes }
	}

	const cancelRequest = () => {
		if ( timeout.current ) {
			clearTimeout( timeout.current )
			timeout.current = null
		}
		if ( request.current ) {
			request.current.cancel()
			request.current = null
		}
	}

	// Prep result data
	const entries = results ? Object.entries( results ) : null
	const hasResults = entries && entries.length
	const groups = hasResults ? Object.entries( results ).map( ( [ , group ] ) => group[0] ) : []

	const Toolbar = () => {
		const focusRef = useInitialFocus()
		return (
			<div className='fl-asst-search-form-simple'>
				<input
					type="search"
					value={keyword}
					onChange={ e => setKeyword( e.target.value ) }
					placeholder={ __( 'Search' ) }
					ref={focusRef}
				/>
				{ loading &&
				<div className='fl-asst-search-spinner'>
					<Icon.SmallSpinner />
				</div>
				}
			</div>
		)
	}

	return (
		<Page shouldShowHeader={false} shouldPadSides={false} shouldPadBottom={false} toolbar={<Toolbar />}>

			{ '' === keyword &&
			<>
				{ searchHistory.length &&
				<Page.Pad>
					<Button.Group label={__( 'Recent Searches' )}>
						{ searchHistory.map( ( keyword, key ) =>
							<Button
								key={ key }
								onClick={ e => setKeyword( keyword ) }
							>
								"{ keyword }"
							</Button>
						) }
					</Button.Group>
				</Page.Pad>
				}
			</>
			}

			{ results && ! hasResults &&
				<Page.Toolbar>{ __( 'Please try a different search.' ) }</Page.Toolbar>
			}

			{ 0 < groups.length &&
				<List.Scroller
					items={groups}
					isListSection={ item => 'undefined' !== typeof item.label }
					getSectionItems={ section => section.items ? section.items : [] }
					loadItems={ ( setHasMore ) => {
						setTimeout( () => setHasMore( false ), 2000 )
					} }
					getItemProps={ ( item, defaultProps, isSection ) => {
						let props = { ...defaultProps }

						if ( isSection ) {
							props.label = item.label
						} else {
							props.shouldAlwaysShowThumbnail = true

							if ( 'undefined' !== typeof item.label ) {
								props.label = item.label
							} else if ( 'undefined' !== typeof item.title ) {
								props.label = item.title
							}

							if ( 'undefined' !== typeof item.thumbnail ) {
								props.thumbnail = item.thumbnail
							}

							// Determine Detail View
							const type = 'post' // HARDCODED FOR NOW - NEED TO DISTINGUISH OBJECT TYPES
							const basePath = match.url
							let path = null

							switch ( type ) {
							case 'post':
								path = `${basePath}/posts/${item.id}`
								break
							case 'user':
								path = `${basePath}/users/${3}`
								break
							case 'attachment':
							case 'plugin':
							case 'theme':
							case 'comment':
							}
							if ( path ) {
								props.to = {
									pathname: path,
									state: { item },
								}
							}
						}

						return props
					}}
				/>
			}

		</Page>
	)
}
