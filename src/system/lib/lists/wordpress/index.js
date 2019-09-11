import React, { useEffect } from 'fl-react'
import { CancelToken, isCancel } from 'axios'
import { getWpRest } from 'shared-utils/wordpress'
import { List } from 'lib'

export const WordPress = ( {
	type = 'posts',
	getItemProps = ( item, defaultProps ) => defaultProps,
	formatItems = items => items,
	onItemsLoaded = () => {},
	query = {},
	...rest,
} ) => {
	const { items, setItems, updateItem, removeItem, cloneItem } = List.useListItems()
	const { getPagedContent } = getWpRest()
	const source = CancelToken.source()

	useEffect( () => {
		setItems( [] )
	}, [ type, JSON.stringify( query ) ] )

	return (
		<List.Scroller
			items={ formatItems( items ) }
			loadItems={ ( setHasMore ) => {
				getPagedContent( type, query, items.length, {
					cancelToken: source.token,
				} ).then( response  => {
					setItems( items.concat( response.data.items ) )
					setHasMore( response.data.has_more )
					onItemsLoaded( response )
				} ).catch( ( error ) => {
					if ( ! isCancel( error ) ) {
						console.log( error ) // eslint-disable-line no-console
					}
				} )
			} }
			getItemProps={ ( item, defaultProps ) => {
				return getItemProps( item, {
					...defaultProps,
					removeItem,
					cloneItem,
					updateItem,
				} )
			} }
			{ ...rest }
		/>
	)
}
