import React, { useEffect, useState } from 'fl-react'
import { __ } from 'assistant/i18n'
import { getWpRest } from 'assistant/utils/wordpress'
import { addLeadingSlash } from 'assistant/utils/url'
import { useSystemState, getSystemActions, useAppState, getAppActions } from 'assistant/data'
import { Nav, Page, List, Icon, Button } from 'assistant/ui'
import { CancelToken, isCancel } from 'axios'
import { getRequestConfig } from '../config'
import './style.scss'

export const Main = ( { match } ) => {
	const { searchHistory } = useSystemState()
	const { setSearchHistory } = getSystemActions()
	const { keyword } = useAppState( 'fl-search' )
	const { setKeyword } = getAppActions( 'fl-search' )
	const { config, routes } = getRequestConfig( keyword )
	const [ loading, setLoading ] = useState( false )
	const [ results, setResults ] = useState( null )
	const [ viewAllKey, setViewAllKey ] = useState( null )
	const wp = getWpRest()
	let source = CancelToken.source()

	useEffect( () => {
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
			const results = []

			response.data.map( ( result, key ) => {
				const { label, format } = config[ key ]
				if ( ! result.items ) {
					return
				}
				results.push( {
					label,
					items: format( result.items ).map( item => {
						item.configKey = key
						return item
					} ),
					configKey: key,
				} )
			} )

			setResults( results )
			setLoading( false )
			setSearchHistory( keyword )
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )

		return () => source.cancel()
	}, [ keyword ] )

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

			{ results && ! results.length &&
				<Page.Toolbar>{ __( 'Please try a different search.' ) }</Page.Toolbar>
			}

			{ null !== viewAllKey && results && results.length &&
				<button onClick={ () => setViewAllKey( null ) }>Go back</button>
			}

			{ null === viewAllKey && results && results.length &&
				<List
					items={ results }
					isListSection={ item => 'undefined' !== typeof item.label }
					getSectionItems={ section => section.items ? section.items : [] }
					getItemProps={ ( item, defaultProps, isSection ) => {
						const { configKey } = item
						const { detail } = config[ configKey ]
						let props = { ...defaultProps }

						if ( isSection ) {
							props.label = item.label
							props.footer = (
								<button onClick={ () => setViewAllKey( configKey ) }>View All</button>
							)
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

							if ( detail ) {
								props.to = {
									pathname: match.url + addLeadingSlash( detail.pathname( item ) ),
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
