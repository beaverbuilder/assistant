import React, { useState, memo } from 'react'
import c from 'classnames'
import { useSystemState, getSystemActions, getSystemState } from 'data'
import { List } from 'ui'
import './style.scss'

const AppList = memo( ( {
	className,
	onSortStart = () => {},
	onSortEnd = () => {},
	children: Item,
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

	return (
		<List.Sortable
			className={ classes }
			items={ appOrder }
			keyProp={ item => item }
			setItems={ items => setAppOrder( items ) }
			onSortStart={ items => {
				setIsSorting( true )
				onSortStart( items )
			} }
			onSortEnd={ items => {
				setIsSorting( false )
				setAppOrder( items, true ) // persist to backend
				onSortEnd( items )
			} }
			{ ...rest }
		>
			{ ( handle, i ) => (
				<Item
					isFirst={ 0 === i }
					isLast={ i === appOrder.length - 1 }
					{ ...apps[ handle ] }
				/>
			) }
		</List.Sortable>
	)
} )

export default AppList
