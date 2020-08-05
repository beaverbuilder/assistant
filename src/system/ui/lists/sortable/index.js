import React, { useState } from 'react'
import c from 'classnames'
import usePositionReorder from './use-position-reorder'
import Item from './item'
import './style.scss'

const Sortable = ( {
	tag: Tag = 'ul',
	items = [],
	setItems = () => {},
	children,
	className,
	keyProp = 'handle', // key name or function that returns key
	itemProps = {},
	onSortStart = () => {},
	onSortEnd = () => {},
	before,
	after,
	...rest
} ) => {
	const [ order, updatePosition, updateOrder ] = usePositionReorder( items, setItems )
	const [ isSorting, setIsSorting ] = useState( false )

	// Need to provide a unique key for each item
	// Indexes do not work well here.
	const getItemKey = ( item, i ) => {
		return 'function' === typeof keyProp ? keyProp( item, i ) : item[ keyProp ]
	}

	return (
		<Tag
			className={ c( { 'is-sorting': isSorting }, className ) }
			{ ...rest }
		>
			{ before }
			{ order.map( ( item, i ) => {
				return (
					<Item
						key={ getItemKey( item, i ) }
						i={ i }
						updatePosition={ updatePosition }
						updateOrder={ updateOrder }
						onSortStart={ () => {
							setIsSorting( true )
							'function' === typeof onSortStart && onSortStart()
						} }
						onSortEnd={ () => {
							setIsSorting( false )
							'function' === typeof onSortEnd && onSortEnd()
						} }
						{ ...itemProps }
					>
						{ children( item ) }
					</Item>
				)
			} )}
			{ after }
		</Tag>
	)
}


export default Sortable
