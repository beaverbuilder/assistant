import React, { useRef, useState, useContext } from 'fl-react'
import classname from 'fl-classnames'
import { __ } from 'assistant/i18n'
import { useComponentUpdate } from 'assistant/utils/react'
import { addLeadingSlash } from 'assistant/utils/url'
import { getSearchResults } from 'assistant/utils/wordpress'
import { useSystemState } from 'assistant/data'
import { Page, List, Form, Icon, Nav } from 'assistant/ui'
import './style.scss'

export const Main = () => {
	const { apps } = useSystemState()
	const [ keyword, setKeyword ] = useState( '' )
	const [ loading, setLoading ] = useState( false )
	const [ results, setResults ] = useState( null )
	const timeout = useRef( null )
	const request = useRef( null )
	const classes = classname( {
		'fl-asst-search': true,
		'fl-asst-search-is-loading': loading,
	} )

	const nav = useContext( Nav.Context )
	console.log('nav', nav )

	useComponentUpdate( () => {
		const { config, routes } = getRequestConfig()

		cancelRequest()

		if ( '' === keyword ) {
			setResults( null )
			return
		}

		timeout.current = setTimeout( () => {
			setLoading( true )

			request.current = getSearchResults( routes, response => {
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

	const entries = results ? Object.entries( results ) : null
	const hasResults = entries && entries.length
	const groups = hasResults ? Object.entries( results ).map( ([key, group]) => group[0] ) : []

    return (
        <Page shouldShowHeader={false} shouldPadTop={true} shouldPadSides={false}>

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

			{ groups.length > 0 &&
				<List
					items={groups}
					isListSection={ item => 'undefined' !== typeof item.label }
					getSectionItems={ section => section.items ? section.items : [] }

					getItemProps={ ( item, defaultProps, isSection ) => {
						let props = {
							...defaultProps,
						}

						console.log('item', item, defaultProps, isSection )

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

							props.to = '/detail'
						}

						return props
					}}
				/>
			}

			{ /*
			<form className={ classes }>
	            { results && Object.entries( results ).map( ( [ key, groups ] ) => {
					return groups.map( ( group, key ) => {
						return (
							<Form.Section key={ key } isInset={ false } label={ group.label }>
								<List
									items={ group.items }
									defaultItemProps={ {
								        shouldAlwaysShowThumbnail: true,
								        thumbnailSize: 'sm',
								    } }
								/>
							</Form.Section>
						)
					} )
				} ) }

				{ results && ! Object.entries( results ).length &&
					<Form.Section isInset={ false } label={ __( 'No Results Found' ) }>
						<Form.Item>
							{ __( 'Please try a different search.' ) }
						</Form.Item>
					</Form.Section>
				}
			</form>
			*/ }
        </Page>
    )
}
