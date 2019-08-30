import React, { useEffect, useState } from 'fl-react'
import { __ } from 'assistant/i18n'
import { getWpRest } from 'assistant/utils/wordpress'
import { useSystemState, getSystemActions, useAppState, getAppActions } from 'assistant/data'
import { Page, List, Icon, Button } from 'assistant/ui'
import { CancelToken, isCancel } from 'axios'
import { getRequestConfig, getListSectionConfig, getListItemConfig } from '../config'
import './style.scss'

export const Main = ( { match } ) => {
	const { searchHistory } = useSystemState()
	const { setSearchHistory } = getSystemActions()
	const { keyword } = useAppState( 'fl-search' )
	const { setKeyword } = getAppActions( 'fl-search' )
	const [ loading, setLoading ] = useState( false )
	const [ results, setResults ] = useState( null )
	const { config, routes } = getRequestConfig( { keyword } )
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
		setResults( null )

		wp.search( keyword, routes, {
			cancelToken: source.token,
		} ).then( response => {
			const results = []

			response.data.map( ( result, key ) => {
				const { label, format } = config[ key ]
				if ( ! result.items || ! result.items.length ) {
					return
				}
				results.push( {
					label,
					configKey: key,
					items: format( result.items ).map( item => {
						return { ...item, configKey: key }
					} ),
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

	const Header = () => {
		return (
			<Page.Pad bottom={ false }>
				<div className='fl-asst-search-form-simple'>
					<input
						type="search"
						value={ keyword }
						onChange={ e => setKeyword( e.target.value ) }
						placeholder={ __( 'Search' ) }
					/>
					{ '' !== keyword && <Button appearance="transparent" onClick={ () => setKeyword( '' ) }>{__( 'Clear' )}</Button> }
					{ loading &&
						<div className='fl-asst-search-spinner'>
							<Icon.SmallSpinner/>
						</div>
					}
				</div>
			</Page.Pad>
		)
	}

	return (
		<Page
			shouldShowHeader={ false }
			shouldPadTop={ true }
			shouldPadSides={ false }
			header={ <Header /> }
		>

			{ results && ! results.length &&
				<Page.Toolbar>{ __( 'Please try a different search.' ) }</Page.Toolbar>
			}

			{ ( '' === keyword || results && ! results.length ) &&
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

			{ results && !! results.length &&
				<List
					items={ results }
					getSectionProps={ ( section, defaultProps ) => {
						return getListSectionConfig( {
							section,
							defaultProps,
							keyword,
							match,
						} )
					} }
					getItemProps={ ( item, defaultProps ) => {
						return getListItemConfig( {
							item,
							defaultProps,
							config,
							match,
						} )
					} }
				/>
			}

		</Page>
	)
}
