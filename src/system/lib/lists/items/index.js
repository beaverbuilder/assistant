import React, { useEffect, useRef, useState } from 'fl-react'
import uuidv1 from 'uuid/v1'

export const useListItems = () => {
	const [ items, setItems ] = useState( [] )
	const itemsRef = useRef( { items } )

	useEffect( () => {
		itemsRef.current.items = items
	}, [ items ] )

	const getItemKey = ( uuid ) => {
		const { items } = itemsRef.current
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
		const { items } = itemsRef.current
		const key = getItemKey( uuid )
		if ( key > -1 ) {
			items[ key ] = Object.assign( items[ key ], newProps )
			setItems( [ ...items ] )
		}
	}

	const removeItem = ( uuid ) => {
		const { items } = itemsRef.current
		const key = getItemKey( uuid )
		if ( key > -1 ) {
			items.splice( key, 1 )
			setItems( [ ...items ] )
		}
	}

	const cloneItem = ( uuid, newProps = {} ) => {
		const { items } = itemsRef.current
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

	return {
		setItems: items => {
			items.map( ( item, i ) => {
				if ( ! items[ i ].uuid ) {
					items[ i ].uuid = uuidv1()
				}
			} )
			setItems( [ ...items ] )
		},
		items,
		updateItem,
		removeItem,
		cloneItem,
	}
}
