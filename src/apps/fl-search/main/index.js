import React, { useEffect, useRef, useState, useContext } from 'fl-react'
import classname from 'fl-classnames'
import { __ } from 'assistant/i18n'
import { addLeadingSlash } from 'assistant/utils/url'
import { getSearchResults } from 'assistant/utils/wordpress'
import { useSystemState, getSystemActions, useAppState, getAppActions } from 'assistant/data'
import { Page, List, Icon, Button } from 'assistant/ui'
import './style.scss'

export const Main = () => {
	const { apps, searchHistory } = useSystemState()
	const { setSearchHistory } = getSystemActions()
	const { keyword } = useAppState()
	const { setKeyword } = getAppActions()
	const [ loading, setLoading ] = useState( false )
	const [ results, setResults ] = useState( null )
	const timeout = useRef( null )
	const request = useRef( null )
	const classes = classname( {
		'fl-asst-search': true,
		'fl-asst-search-is-loading': loading,
	} )

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
	const groups = hasResults ? Object.entries( results ).map( ([key, group]) => group[0] ) : []

    return (
        <Page shouldShowHeader={false} shouldPadTop={true} shouldPadSides={false} shouldPadBottom={false}>

            <Page.Toolbar>
				<div className='fl-asst-search-form-simple'>
	                <input
	                    value={keyword}
	                    onChange={ e => setKeyword( e.target.value ) }
	                    placeholder={ __('Search') }
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
					<Page.Pad bottom={false}>
						<Button.Group label={__('Recent Searches')}>
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
				<Page.Pad bottom={false} >
					<Button.Group label={__('Post Type')}>
						<Button>{__('Posts')}</Button>
						<Button>{__('Pages')}</Button>
						<Button>{__('Forms')}</Button>
						<Button>{__('Products')}</Button>
					</Button.Group>
				</Page.Pad>
				<Page.Pad >
					<Button.Group label={__('Status')}>
						<Button>{__('Published')}</Button>
						<Button>{__('Drafted')}</Button>
						<Button>{__('Pending')}</Button>
						<Button>{__('Trashed')}</Button>
					</Button.Group>
				</Page.Pad>
			</>
			}

			<div className="fl-asst-scroller">

				{ results && !hasResults && <Page.Toolbar>{ __( 'Please try a different search.' ) }</Page.Toolbar> }

				{ groups.length > 0 &&
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
							}

							return props
						}}
					/>
				}
			</div>

        </Page>
    )
}
