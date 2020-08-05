import React, { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Uploader } from '@beaverbuilder/cloud-ui'
import { Page } from 'assistant/ui'
import { useAppState } from 'assistant/data'
import cloud from 'assistant/cloud'

import LibraryActions from './actions'
import LibraryItems from './items'
import LibrarySettings from './settings'
import LibraryContext from './context'

import './style.scss'

export default ( { match } ) => {
	const { id } = match.params
	const [ library, setLibrary ] = cloud.libraries.useOne( id )
	const [ items, setItems ] = useState( null )
	const { itemsFilter } = useAppState( 'fl-cloud-libraries', 'itemsFilter' )
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
		<LibraryContext.Provider value={ context }>
			<Page
				title={ __( 'Library' ) }
				shouldShowBackButton={ true }
				actions={ <LibraryActions /> }
				padX={ false }
				padY={ false }
			>
				<Switch>
					<Route exact path={ '/fl-cloud-libraries/:id' } component={ LibraryItems } />
					<Route path={ '/fl-cloud-libraries/:id/settings' } component={ LibrarySettings } />
				</Switch>
			</Page>
		</LibraryContext.Provider>
	)
}
