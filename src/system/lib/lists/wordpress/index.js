import React, { useEffect, useState, useContext } from 'fl-react'
import { CancelToken, isCancel } from 'axios'
import { getWpRest } from 'shared-utils/wordpress'
import { App, List } from 'lib'

export const WordPress = ( {
	type = 'posts',
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {},
	...rest,
} ) => {
	const [ items, setItems ] = useState( [] )
	const { handle } = useContext( App.Context )
	const { getPagedContent } = getWpRest()
	const source = CancelToken.source()
	const offset = items.length
	const hasItems = 0 < items.length

	useEffect( () => {
		return () => source.cancel()
	}, [] )

	return (
		<List.Scroller
			items={ items }
			loadItems={ ( setHasMore ) => {
				getPagedContent( type, query, offset, {
					cancelToken: source.token,
				} ).then( response  => {
					setItems( items.concat( response.data.items ) )
					setHasMore( response.data.has_more )
				} ).catch( ( error ) => {
					if ( ! isCancel( error ) ) {
						console.log( error )
					}
				} )
			} }
			getItemProps={ ( item, defaultProps ) => {
				return getItemProps( item, {
					...defaultProps,
					to: {
						pathname: `/${handle}/${type}/${item.id}`,
						state: item
					},
				} )
			}}
			{ ...rest }
		/>
	)
}
