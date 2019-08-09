import React, { useEffect, useState } from 'fl-react'
import { __ } from 'assistant/i18n'
import { addLeadingSlash } from 'assistant/utils/url'
import { getWpRest } from 'assistant/utils/wordpress'
import { useSystemState, getSystemActions, useAppState, getAppActions } from 'assistant/data'
import { Page, List, Icon, Button } from 'assistant/ui'
import { CancelToken, isCancel } from 'axios'
import './style.scss'

export const Main = ( { match } ) => {
	const { apps, searchHistory } = useSystemState()
	const { setSearchHistory } = getSystemActions()
	const { keyword } = useAppState( 'fl-search' )
	const { setKeyword } = getAppActions( 'fl-search' )
	const [ loading, setLoading ] = useState( false )
	const [ results, setResults ] = useState( null )
	const wp = getWpRest()
	let source = CancelToken.source()

	useEffect( () => {
		const { config, routes } = getRequestConfig()

		if ( '' === keyword ) {
			setResults( null )
			return
		}

		source.cancel()
		source = CancelToken.source()
		setLoading( true )

		wp.search( keyword, routes, {
			cancelToken: source.token,
		} ).then( response => {
			const newResults = {}

			response.data.map( ( result, key ) => {
				const { label, priority, format } = config[key]

				if ( ! result.items ) {
					return
				}
				if ( ! newResults[priority] ) {
					newResults[priority] = []
				}

				newResults[priority].push( {
					label,
					items: format( result.items ),
				} )
			} )

			setResults( newResults )
			setLoading( false )
			setSearchHistory( keyword )
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )

		return () => {
			source.cancel()
		}

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

		Object.entries( apps ).map( ( data ) => {
			const app = data[ 1 ]
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

	// Prep result data
	const entries = results ? Object.entries( results ) : null
	const hasResults = entries && entries.length
	const groups = hasResults ? Object.entries( results ).map( ( [ , group ] ) => group[0] ) : []

	return (
		<Page shouldShowHeader={ false } shouldPadTop={ true } shouldPadSides={ false } shouldPadBottom={ false }>

			<Page.Toolbar>
				<div className='fl-asst-search-form-simple'>
					<input
						type="search"
						value={ keyword }
						onChange={ e => setKeyword( e.target.value ) }
						placeholder={ __( 'Search' ) }
					/>
					{ loading &&
						<div className='fl-asst-search-spinner'>
							<Icon.SmallSpinner/>
						</div>
					}
				</div>
			</Page.Toolbar>

			{ '' === keyword &&
				<>
				{ searchHistory.length &&
					<Page.Pad>
						<Button.Group label={ __( 'Recent Searches' ) }>
							{ searchHistory.map( ( keyword, key ) =>
								<Button
									key={ key }
									onClick={ () => setKeyword( keyword ) }
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
				<List
					items={ groups }
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

							// Determine Detail View
							const type = 'post' // HARDCODED FOR NOW - NEED TO DISTINGUISH OBJECT TYPES
							const basePath = match.url
							let path = null

							switch ( type ) {
							case 'post':
								path = `${basePath}/post/${item.id}`
								break
							case 'user':
								path = `${basePath}/user/${item.id}`
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
					} }
				/>
			}

		</Page>
	)
}
