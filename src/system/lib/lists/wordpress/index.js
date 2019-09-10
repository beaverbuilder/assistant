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

	const getItemKey = ( uuid ) => {
		for ( let i = 0; i < items.length; i++ ) {
			if ( 'undefined' === typeof items[ i ].uuid ) {
				continue
			} else if ( items[ i ].uuid == uuid ) {
				return i
			}
		}
		return -1
	}

	const updateItem = ( uuid, newProps = {} ) => {
		const key = getItemKey( uuid )
		if ( key > -1 ) {
			items[ key ] = Object.assign( items[ key ], newProps )
			setItems( [ ...items ] )
		}
	}

	const removeItem = ( uuid ) => {
		const key = getItemKey( uuid )
		if ( key > -1 ) {
			items.splice( key, 1 )
			setItems( [ ...items ] )
		}
	}

	const cloneItem = ( uuid, newProps = {} ) => {
		const key = getItemKey( uuid )
		if ( key > -1 ) {
			const clone = Object.assign( {}, items[ key ], newProps )
			clone.uuid = uuidv1()
			items.splice( key + 1, 0, clone )
			setItems( [ ...items ] )
			return clone
		}
		return null
	}

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
					removeItem,
					cloneItem,
					updateItem,
					getItemKey,
				} )
			} }
			{ ...rest }
		/>
	)
}
