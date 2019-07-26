import React, { useEffect, useRef, useState } from 'fl-react'
import { __ } from 'assistant/i18n'
import { addLeadingSlash } from 'assistant/utils/url'
import { getSearchResults, cancelRequest } from 'assistant/utils/wordpress'
import { useSystemState, getSystemActions, useAppState, getAppActions } from 'assistant/data'
import { Page, List, Icon, Button } from 'assistant/ui'
import './style.scss'

export const Main = ( { match } ) => {
	const { apps, searchHistory } = useSystemState()
	const { setSearchHistory } = getSystemActions()
	const { keyword } = useAppState()
	const { setKeyword } = getAppActions()
	const [ loading, setLoading ] = useState( false )
	const [ results, setResults ] = useState( null )
	const timeout = useRef( null )
	const request = useRef( null )

	useEffect( () => {
		const { config, routes } = getRequestConfig()

		doCancelRequest()

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

		return doCancelRequest
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

	const doCancelRequest = () => {
		if ( timeout.current ) {
			clearTimeout( timeout.current )
			timeout.current = null
		}
		if ( loading) {
			cancelRequest();
			setLoading(false);
		}
	}

	// Testing scroll loading
	const scrollRef = useRef()
	const { isFetching, resetIsFetching } = List.useScrollLoader( {
		ref: scrollRef,
		callback: ( reset ) => {

			// after loaded, reset()
		}
	} )

	// Prep result data
	const entries = results ? Object.entries( results ) : null
	const hasResults = entries && entries.length
	const groups = hasResults ? Object.entries( results ).map( ( [ key, group ] ) => group[0] ) : []

	return (
		<Page shouldShowHeader={false} shouldPadTop={true} shouldPadSides={false} shouldPadBottom={false}>

			<Page.Toolbar>
				<div className='fl-asst-search-form-simple'>
					<input
						type="search"
						value={keyword}
						onChange={ e => setKeyword( e.target.value ) }
						placeholder={ __( 'Search' ) }
					/>
					{ loading &&
					<div className='fl-asst-search-spinner'>
						<Icon.SmallSpinner />
					</div>
					}
				</div>
			</Page.Toolbar>

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

			<div className="fl-asst-scroller" ref={scrollRef}>

				{ results && ! hasResults && <Page.Toolbar>{ __( 'Please try a different search.' ) }</Page.Toolbar> }

				{ 0 < groups.length &&
					<List
						items={groups}
						isListSection={ item => 'undefined' !== typeof item.label }
						getSectionItems={ section => section.items ? section.items : [] }

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

								props.to = {
									pathname: `${match.url}/posts/${3}`,
									state: item,
								}
							}

							return props
						}}
					/>
				}
				{ isFetching && <List.Loading /> }
			</div>

		</Page>
	)
}