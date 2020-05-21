import React, { useEffect, useState, useRef } from 'react'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'assistant/utils/wordpress'
import { useAppState, getAppActions, getSystemHooks } from 'assistant/data'
import { Page, List, Icon, Button, Layout } from 'assistant/ui'
import { CancelToken, isCancel } from 'axios'
import { getRequestConfig, getListSectionConfig, getListItemConfig } from '../config'
import './style.scss'

const Main = ( { baseURL, handle } ) => {
	const { useSearchHistory } = getSystemHooks()
	const [ searchHistory, setSearchHistory ] = useSearchHistory()

	const { keyword } = useAppState( handle )
	const { setKeyword } = getAppActions( handle )

	const [ loading, setLoading ] = useState( false )
	const [ results, setResults ] = useState( null )

	const { config, routes } = getRequestConfig( { keyword } )

	const wp = getWpRest()
	let source = CancelToken.source()

	// Every time keyword changes
	useEffect( () => {
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

			if ( results.length && '' !== keyword ) {
				setSearchHistory( keyword )
			}

			setResults( results )
			setLoading( false )
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )

		return () => source.cancel()
	}, [ keyword ] )

	const Header = () => {
		const inputRef = useRef( null )

		useEffect( () => {
			if ( inputRef.current ) {
				inputRef.current.focus()
			}
		}, [] )

		return (
			<div style={ { flex: '1 1 auto', display: 'flex', flexDirection: 'row' } }>
				<div className='fl-asst-search-form-simple'>
					<input
						type="text"
						value={ keyword }
						onChange={ e => setKeyword( e.target.value ) }
						placeholder={ __( 'Search' ) }
						ref={ inputRef }
					/>
					<span style={ { marginLeft: 5, flex: '0 0 auto', display: 'flex', flexDirection: 'row' } }>
						{ '' !== keyword && <Button onClick={ () => setKeyword( '' ) }>{__( 'Clear' )}</Button> }
						{ '' !== keyword && loading &&
						<div className='fl-asst-search-spinner'>
							<Icon.SmallSpinner/>
						</div>
						}
					</span>
				</div>
			</div>
		)
	}

	return (
		<Page
			padY={ false }
			title={ <Header /> }
		>

			{ null !== results && ! results.length &&
				<Layout.Box padX={ false }>{ __( 'Please try a different search.' ) }</Layout.Box>
			}

			{ ( '' === keyword || ( null !== results && ! results.length ) ) &&
				<>
				{ 0 < searchHistory.length &&
					<Page.Section>
						<Button.Group
							label={ __( 'Recent Searches' ) }
							appearance="buttons"
						>
							{ searchHistory.map( ( keyword, key ) =>
								<Button
									key={ key }
									onClick={ () => setKeyword( keyword ) }
								>
									"{ keyword }"
								</Button>
							) }
						</Button.Group>
					</Page.Section>
				}
				</>
			}

			{ null !== results && !! results.length &&
				<List
					items={ results }
					getSectionProps={ ( section, defaultProps ) => {
						return getListSectionConfig( {
							section,
							defaultProps,
							keyword,
							baseURL,
						} )
					} }
					getItemProps={ ( item, defaultProps ) => {
						return getListItemConfig( {
							item,
							defaultProps,
							config,
							baseURL,
						} )
					} }
				/>
			}

		</Page>
	)
}

export default Main
