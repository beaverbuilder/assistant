import React, { useState, memo } from 'react'
import c from 'classnames'
import move from 'array-move'
import { useSystemState, getSystemActions, getSystemState } from 'data'
import { List } from 'ui'
import './style.scss'

const AppList = memo( ( {
	className,
	onSortStart = () => {},
	onSortEnd = () => {},
	children: Item,
	limit,
	...rest
} ) => {
	const { appOrder } = useSystemState()
	const { setAppOrder } = getSystemActions()
	const { apps } = getSystemState()
	const [ isSorting, setIsSorting ] = useState( false )

	const classes = c( {
		'fl-asst-app-list': true,
		'is-sorting': isSorting
	}, className )

	const filtered = appOrder.filter( handle => {
		return (
			Object.keys( apps ).includes( handle ) &&
			false !== apps[ handle ].shouldShowInAppList
		)
	} ).filter( ( _, i ) => {

		if ( limit ) {
			return ( i + 1 ) <= limit
		}
		return true
	} )

	const setOrder = ( items, persist = false ) => {

		let keys = items

		// If we're limiting the items,
		// we need to put back the unlisted items before saving
		if ( limit && items.length !== appOrder.length ) {
			const remaining = appOrder.filter( ( _, i ) => {
				return ( i + 1 ) > limit
			} )
			const all = [ ...items, ...remaining ]
			keys = all
		}

		// De-dupe the values
		setAppOrder( [ ...new Set( keys ) ], persist )
	}
	const moveItem = ( from, to ) => setOrder( move( filtered, from, to ), true )

	return (
		<List.Sortable
			className={ classes }
			items={ filtered }
			keyProp={ item => item }
			setItems={ items => setOrder( items ) }
			onSortStart={ items => {
				setIsSorting( true )
				onSortStart( items )
			} }
			onSortEnd={ items => {
				setIsSorting( false )
				setOrder( items, true ) // persist to backend
				onSortEnd( items )
			} }
			{ ...rest }
		>
			{ ( handle, i ) => (
				<Item
					isFirst={ 0 === i }
					isLast={ i === appOrder.length - 1 }
					moveUp={ () => moveItem( i, i - 1 ) }
					moveDown={ () => moveItem( i, i + 1 ) }
					{ ...apps[ handle ] }
				/>
			) }
		</List.Sortable>
	)
} )

export default AppList
