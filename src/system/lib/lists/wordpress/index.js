import React, { useEffect, useState } from 'react'
import { CancelToken, isCancel } from 'axios'
import { getWpRest } from 'utils/wordpress'
import { List } from 'lib'

export const WordPress = ( {
	type = 'posts',
	getItemProps = ( item, defaultProps ) => defaultProps,
	formatItems = items => items,
	onItemsLoaded = () => {},
	query = {},
	paginate = true,
	...rest
} ) => {
	const [ hasMoreItems, setHasMoreItems ] = useState( true )
	const { items, setItems, updateItem, removeItem, cloneItem } = List.useListItems()
	const { getPagedContent } = getWpRest()
	const source = CancelToken.source()

	const itemProps = ( item, defaultProps ) => {
		return getItemProps( item, {
			...defaultProps,
			removeItem,
			cloneItem,
			updateItem,
		} )
	}

	const loadItems = ( loadingComplete ) => {
		getPagedContent( type, query, items.length, {
			cancelToken: source.token,
		} ).then( response  => {
			setItems( items.concat( response.data.items ) )
			setHasMoreItems( loadingComplete ? response.data.has_more : false )
			onItemsLoaded( response )
			loadingComplete && loadingComplete()
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )
	}

	useEffect( () => {
		if ( ! paginate ) {
			loadItems()
		}
	}, [] )

	useEffect( () => {
		setHasMoreItems( true )
		setItems( [] )
	}, [ type, JSON.stringify( query ) ] )

	if ( paginate ) {
		return (
			<List.Scroller
				items={ formatItems( items ) }
				hasMoreItems={ hasMoreItems }
				loadItems={ loadItems }
				getItemProps={ itemProps }
				{ ...rest }
			/>
		)
	}

	return (
		<List
			items={ formatItems( items ) }
			getItemProps={ itemProps }
			{ ...rest }
		/>
	)
}
