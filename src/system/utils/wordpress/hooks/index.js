import { useState, useEffect, useRef } from 'react'
import { getWpRest } from '../rest'
import { CancelToken, isCancel } from 'axios'

const defaultQuery = {
	posts_per_page: 36
}

const defaultState = {
	currentOffset: 0,
	currentPage: 1,
	firstPage: 1,
	lastPage: 1,
	items: [],
	itemsPerPage: 36,
	hasMore: false,
	totalItems: 0,
}

export const useAttachments = ( _query = {} ) => {
	const { getPagedContent } = getWpRest()
	const source = CancelToken.source()
	const [ state, setState ] = useState( { ...defaultState } )
	const isFetching = useRef( false )
	const setIsFetching = value => isFetching.current = value
	const query = { ...defaultQuery, ..._query }

	const handleResponse = ( response, replace ) => {
		setIsFetching( false )

		const {
			items: newItems,
			has_more,
			current_offset,
			current_page,
			first_page,
			items_count,
			items_per_page,
			last_page
		} = response.data

		let items = [ ...state.items, ...newItems ]
		if ( replace ) {
			items = newItems
		}

		setState( {
			...defaultState,
			...state,
			currentOffset: current_offset,
			currentPage: current_page,
			firstPage: first_page,
			lastPage: last_page,
			items,
			itemsPerPage: items_per_page,
			hasMore: has_more,
			totalItems: items_count
		} )
	}

	const loadItems = ( offset = 0, replace = false ) => {

		if ( isFetching.current ) {
			return
		}

		console.log( 'load items', offset, replace )

		setIsFetching( true )

		return getPagedContent( 'attachments', query, offset, {
			cancelToken: source.token,
		} )
			.then( response => handleResponse ( response, replace ) )
			.catch( error => {
				setIsFetching( false )

				if ( ! isCancel( error ) ) {
					console.log( error ) // eslint-disable-line no-console
				}
			} )
	}

	// Initial Load
	useEffect( () => {
		loadItems( state.offset )
		return source.cancel
	}, [] )

	// If query changes
	useEffect( () => {
		if ( ! isFetching.current ) {
			loadItems( 0, true )
		}
		return source.cancel
	}, [ JSON.stringify( _query ) ] )

	const reloadItems = () => loadItems( 0, true )

	return {
		...state,
		loadItems,
		isFetching: isFetching.current,
		reloadItems
	}
}
