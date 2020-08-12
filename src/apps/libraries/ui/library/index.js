import React, { useEffect, useState } from 'react'
import { useLocation, useParams, Switch, Route } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Libraries, Uploader } from '@beaverbuilder/cloud-ui'
import { Page } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import cloud from 'assistant/cloud'

import LibraryActions from './actions'
import LibraryItems from './items'
import LibraryItem from '../library-item'
import LibrarySettings from './settings'

import './style.scss'

export default () => {
	const { pathname } = useLocation()
	const { id } = useParams()
	const [ library, setLibrary ] = cloud.libraries.useOne( id )
	const [ items, setItems ] = useState( null )
	const { itemsFilter } = useAppState( 'libraries', 'itemsFilter' )
	const [ showUpload, setShowUpload ] = useState( false )
	const [ uploadTab, setUploadTab ] = useState( 'posts' )

	const uploader = Uploader.useLibrary( id, {
		onUploadComplete: item => {
			items.push( item )
			setItems( [ ...items ] )
		}
	} )

	useEffect( () => {
		const { order, order_by } = itemsFilter
		cloud.libraries.searchItems( id, query => {
			query.sort( ( 'ASC' === order ? '' : '-' ) + order_by )
			return query
		} ).then( response => {
			setItems( response.data )
		} )
	}, [ itemsFilter ] )

	if ( ! library ) {
		return <Page.Loading />
	}

	const context = {
		library,
		setLibrary,
		items,
		setItems,
		showUpload,
		setShowUpload,
		uploadTab,
		setUploadTab,
		uploader
	}

	return (
		<Libraries.LibraryContext.Provider value={ context }>
			<div
				style={ {
					visibility: pathname.includes( '/items/' ) ? 'hidden' : '',
					width: '100%',
					flex: '1 1 auto',
					display: 'flex'
				} }
			>
				<Page
					title={ __( 'Library' ) }
					shouldShowBackButton={ true }
					actions={ <LibraryActions /> }
					padX={ false }
					padY={ false }
				>
					<Switch>
						<Route path='/libraries/:id/settings' component={ LibrarySettings } />
						<Route path='/libraries/:id' component={ LibraryItems } />
					</Switch>
				</Page>
			</div>
			<Switch>
				<Route path='/libraries/:id/items/:itemId' component={ LibraryItem } />
			</Switch>
		</Libraries.LibraryContext.Provider>
	)
}
