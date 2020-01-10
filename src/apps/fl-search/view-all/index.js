import React, { useEffect, useState } from 'react'
import { CancelToken, isCancel } from 'axios'
import { __, sprintf } from '@wordpress/i18n'
import { Page, List } from 'assistant/ui'
import { getWpRest } from 'assistant/utils/wordpress'
import { getRequestConfig, getListItemConfig } from '../config'

export const ViewAll = ( { match, location } ) => {
	const [ items, setItems ] = useState( [] )
	const { keyword, configKey } = location.state
	const { config, routes } = getRequestConfig( { keyword, number: 20, offset: items.length } )
	const { label, format } = config[ configKey ]
	const route = routes[ configKey ]
	const wp = getWpRest()
	const source = CancelToken.source()

	useEffect( () => {
		return () => source.cancel()
	}, [] )

	const getPageTitle = () => {
		if ( '' === keyword ) {
			return label
		}
		return sprintf( __( '%s matching "%s"' ), label, keyword )
	}

	return (
		<Page title={ getPageTitle() } padX={ false }>
			<List.Scroller
				items={ items }
				getItemProps={ ( item, defaultProps ) => {
					return getListItemConfig( {
						item,
						defaultProps,
						config,
						match,
					} )
				} }
				loadItems={ ( setHasMore ) => {
					wp.search( keyword, [ route ], {
						cancelToken: source.token,
					} ).then( response => {
						setItems( items.concat( format( response.data[0].items ).map( item => {
							return { ...item, configKey }
						} ) ) )
						setHasMore( response.data.has_more )
					} ).catch( ( error ) => {
						if ( ! isCancel( error ) ) {
							console.log( error ) // eslint-disable-line no-console
						}
					} )
				} }
			/>
		</Page>
	)
}
