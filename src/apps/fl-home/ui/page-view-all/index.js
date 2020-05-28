import React, { useEffect, useState } from 'react'
import { CancelToken, isCancel } from 'axios'
import { useLocation } from 'react-router-dom'
import { __, sprintf } from '@wordpress/i18n'
import { Page, List } from 'assistant/ui'
import { getWpRest } from 'assistant/utils/wordpress'
import { getRequestConfig, getListItemConfig } from '../../config'

const ViewAll = ({ baseURL }) => {
	const [ items, setItems ] = useState( [] )
	const { keyword, configKey } = useLocation().state
	const { config, routes } = getRequestConfig( { keyword, number: 20, offset: items.length } )
	const { label, format } = config[ configKey ]
	const route = routes[ configKey ]
	const wp = getWpRest()
	const source = CancelToken.source()

	useEffect( () => () => source.cancel(), [] )

	const getPageTitle = () => {
		if ( '' === keyword ) return label
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
						baseURL,
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

export default ViewAll
