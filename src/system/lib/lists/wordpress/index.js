import React, { useEffect, useState } from 'fl-react'
import uuidv1 from 'uuid/v1'
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
	const [ items, setItems ] = useState( [] )
	const { getPagedContent } = getWpRest()
	const source = CancelToken.source()
	const offset = items.length

	useEffect( () => {
		setItems( [] )
	}, [ type, JSON.stringify( query ) ] )

	return (
		<List.Scroller
			items={ formatItems( items ) }
			loadItems={ ( setHasMore ) => {
				getPagedContent( type, query, offset, {
					cancelToken: source.token,
				} ).then( response  => {
					response.data.items.map( ( item, i ) => {
						response.data.items[ i ].uuid = uuidv1()
					} )
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
					removeItem: () => {
						const { key } = defaultProps
						items.splice( key, 1 )
						setItems( [ ...items ] )
					},
					cloneItem: ( newProps = {} ) => {
						const { key } = defaultProps
						const clone = Object.assign( {}, items[ key ], newProps )
						clone.uuid = uuidv1()
						items.splice( key + 1, 0, clone )
						setItems( [ ...items ] )
						return clone
					},
					updateItem: ( newProps = {} ) => {
						const { key } = defaultProps
						items[ key ] = Object.assign( items[ key ], newProps )
						setItems( [ ...items ] )
					},
					updateItemBy: ( key, value, newProps = {} ) => {
						items.map( ( item, i ) => {
							if ( item[ key ] == value ) {
								items[ i ] = Object.assign( items[ i ], newProps )
							}
						} )
						setItems( [ ...items ] )
					},
				} )
			} }
			{ ...rest }
		/>
	)
}
