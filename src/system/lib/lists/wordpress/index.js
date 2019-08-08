import React, { useEffect, useState } from 'fl-react'
import { CancelToken, isCancel } from 'axios'
import { getWpRest } from 'shared-utils/wordpress'
import { List } from 'lib'

export const WordPress = ( {
	type = 'posts',
	getItemProps = ( item, defaultProps ) => defaultProps,
	onItemsLoaded = ( response ) => {},
	query = {},
	...rest,
} ) => {
	const [ items, setItems ] = useState( [] )
	const { getPagedContent } = getWpRest()
	const source = CancelToken.source()
	const offset = items.length
	const hasItems = 0 < items.length

	useEffect( () => {
		setItems( [] )
	}, [ type, query ] )

	return (
		<List.Scroller
			items={ items }
			getItemProps={ getItemProps }
			loadItems={ ( setHasMore ) => {
				getPagedContent( type, query, offset, {
					cancelToken: source.token,
				} ).then( response  => {
					setItems( items.concat( response.data.items ) )
					setHasMore( response.data.has_more )
					onItemsLoaded( response )
				} ).catch( ( error ) => {
					if ( ! isCancel( error ) ) {
						console.log( error )
					}
				} )
			} }
			{ ...rest }
		/>
	)
}
